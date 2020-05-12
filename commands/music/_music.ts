import { myClient } from '../../index';
import { StreamDispatcher, Collection, VoiceConnection, Message} from 'discord.js';
import * as ytdl from 'ytdl-core' ;
import * as ytsr from 'ytsr';

type RepeatSong = 
| 'NO_REPEAT'
| 'REPEAT_QUEUE'
| 'REPEAT_NOW';

interface Song {
    title: string;
    link: string;
    author: string;
    authorLink: string;
    length: number;
}

class Song {
    constructor({title, link, author, authorLink, length}:{title?: string, link?: string, author?: string, authorLink?: string, length?: number}) {
        this.title = title;
        this.link = link;
        this.author = author;
        this.authorLink = authorLink;
        this.length = length;
    }
}

interface MusicPlayer {
    v_connection: VoiceConnection;
    host_message : Message;
    nowPlaying: Song;
    queue: Song[];
    repeatQueue: Song[];
    dispatcher: StreamDispatcher;
    volume: number;
    shuffle: boolean;
    repeat: RepeatSong;
    autoDC: NodeJS.Timer;
    silentcount: number;
    connect_voice(): Promise<void>;
    addToQueue(host_message: Message, song: Song): void;
    removeFromQueue(elementIndex: number): void;
    startPlay(): Promise<void>;
    next(): void;
    play(): void;
    disconnect(): void;
    autoDisconnect(): void;
    shouldDisconnect(): boolean;
    isYoutube(url: string): boolean;
    getYoutubeSong(url: string): Promise<Song>;
    searchYoutube(search: string): Promise<Song[]>;
}

class MusicPlayer {
    constructor({volume = 1.0, shuffle = false, repeat = 'NO_REPEAT'}: 
        {volume?:number, shuffle?:boolean, repeat?:RepeatSong}) 
    {
        this.nowPlaying = null;
        this.queue = [];
        this.repeatQueue = [];
        this.dispatcher = null;
        this.volume = volume;
        this.shuffle = shuffle;
        this.repeat = repeat;
        this.silentcount = 0;
    }
    async connect_voice() {
        if(!this.host_message.guild.voice || !this.host_message.guild.voice.connection)
            this.v_connection = await this.host_message.member.voice.channel.join();
    }
    addToQueue(host_message: Message, song: Song) {
        this.host_message = host_message;
        this.queue.push(song);
    }
    removeFromQueue(elementIndex: number) {
        this.queue.splice(elementIndex, 1);
    }
    async startPlay() {
        this.connect_voice()
        .then( () => {
            this.play();
        });
    }
    next() {
        if(this.queue.length > 0) {
            if(this.repeat !== 'REPEAT_NOW') {
                if(this.shuffle)
                    this.nowPlaying = this.queue.splice(Math.random() * this.queue.length, 1)[0];
                else
                    this.nowPlaying = this.queue.shift();
            }
            if(this.repeat === 'REPEAT_QUEUE') {
                this.repeatQueue.push(this.nowPlaying);
                if(this.queue.length == 0)
                    this.queue = this.repeatQueue;
                this.repeatQueue = [];
            }
        } else if (this.repeat === 'REPEAT_NOW') {
            // Do nothing, since there is no next
        } else {
            // No more songs in queue, null it.
            this.nowPlaying = null;
        }

    }
    play() {
        this.next();
        if(this.nowPlaying) {
            this.autoDisconnect();
            this.dispatcher = this.v_connection.play(ytdl(this.nowPlaying.link, {filter:"audioonly", highWaterMark: 1<<25}));
            this.dispatcher.setVolume(this.volume);
            this.dispatcher.on('finish', () => {
                this.play();
            });
            this.dispatcher.on('error', console.error);
        }
    }
    disconnect() {
        this.nowPlaying = null;
        this.queue = [];
        this.repeatQueue = [];
        this.dispatcher.end();
        this.silentcount = 0;
        this.v_connection.disconnect();
    }
    autoDisconnect() {
        if(!this.autoDC) {
            this.autoDC = setInterval( () => {
                if(this.shouldDisconnect()) {
                    setTimeout(() => {
                        if(this.shouldDisconnect()) {
                            clearInterval(this.autoDC);
                            this.disconnect();
                            this.autoDC = null;
                        }
                    }, 10000);
                }
            }, 5000);
        }
    }
    shouldDisconnect() {
        if(this.v_connection.voice && this.v_connection.voice.connection) {
            if(this.nowPlaying) {
                this.silentcount = 0;
                return this.v_connection.channel.members.filter(member => !member.user.bot).size === 0;
            }
            else if(this.silentcount > 60) { // Should disconnect after 5 minutes of inactivity.
                return true;
            }
            else {
                ++this.silentcount;
            }
        }
        return false;
    }
    static isYoutube(url: string) {
        return ytdl.validateURL(url);
    }
    static async getYoutubeSong(url: string) {
        return ytdl.getBasicInfo(url)
        .then(info => {
            return new Song({
                title: info.title,
                author: info.author.name,
                authorLink: info.author.channel_url, 
                link: info.video_url, 
                length: parseInt(info.length_seconds)})
        })
    }
    static async searchYoutube(search: string) {
        let songs:Song[] = [];
        await ytsr(search, {limit: 25})
        .then( (res) => {
            res.items.filter(item => item.type === 'video')
            .forEach( (item) => {
                songs.push(new Song({
                    title: item.title,
                    author: item.author.name,
                    authorLink: item.author.ref,
                    length: MusicPlayer.ytsrDurationSeconds(item.duration),
                    link: item.link
                }));
            });
        })
        return songs;
    }
    static ytsrDurationSeconds(duration: string) {
        if(duration) {
            const q = duration.match(/[^:]+/g);
            const seconds = q.pop();
            const minutes = q.pop();
            const hours = q.pop();
            let length_seconds = 0;
            if(seconds) {
                length_seconds += parseInt(seconds);
            }
            if(minutes) {
                length_seconds += parseInt(minutes) * 60;
            }
            if(hours) {
                length_seconds += parseInt(hours) * 3600;
            }
            return length_seconds;
        }
        return 0;
    }
}

interface MusicClient extends myClient {
    guildPlayers: Collection<string, MusicPlayer>;
}

export {MusicClient, MusicPlayer, Song};