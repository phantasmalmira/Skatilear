import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message, Collection, StreamDispatcher, VoiceConnection, MessageReaction, User } from 'discord.js';
import * as ytdl from 'ytdl-core';
import * as ytsr from 'ytsr';

interface musicClient extends myClient {
    music: Collection<string, musicPlayer>;
    cursong: Collection<string, song>;
}

interface musicPlayer {
    player: StreamDispatcher;
    queue: song[];
}

interface song {
    title: string;
    uri: string;
}

class song {
    constructor(title: string, uri: string) {
        this.title = title;
        this.uri = uri;
    }
}

class musicPlayer {
    constructor() {
        this.player = null;
        this.queue = [];
    }
}

export{musicClient, musicPlayer};

const ytpattern = RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);

const play_yt = (conn: VoiceConnection, msg: Message, client: musicClient) => {
    let player = client.music.get(msg.guild.id);
    player.player = conn.play(ytdl(player.queue[0].uri, {filter:"audioonly", highWaterMark: 1<<25}));
    if(!client.cursong.has(msg.guild.id)) client.cursong.set(msg.guild.id, player.queue.shift());
    player.player.on('finish', () => {
        client.cursong.delete(msg.guild.id);
        if(player.queue[0]) {
            play_yt(conn, msg, client);
        }
        else {
            conn.disconnect();
        }
    });
    player.player.on('error', console.error);
};

const cmd = new command(
    {
    name: 'play',
    run: async (client: musicClient, msg: Message, args: string[]) => {
        if(!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        const arg0 = args.shift();
        if(ytdl.validateURL(arg0))
        {
            ytdl.getBasicInfo(arg0).then(info => {
                msg.channel.send({embed: {
                    title: 'Selected song 🎵',
                    description: info.title
                }});
                if(!client.music.has(msg.guild.id)) client.music.set(msg.guild.id, new musicPlayer());
                client.music.get(msg.guild.id).queue.push(new song(info.title, info.video_url));
            }).then( () => {
                if(!msg.guild.voice || !msg.guild.voice.connection) msg.member.voice.channel.join()
                .then( connection => {
                    play_yt(connection, msg, client);
                });
            });
        }
        else {
            let searchResult = [];
            await ytsr(`${arg0} ${args.join(' ')}`, {limit: 10})
            .then( (res) => {
                res.items.forEach( i => {
                    if(i.title && i.link && i.author)
                        searchResult.push({title: i.title, uri: i.link, author: i.author});
                    });
            });
            let msgcontent = '';
            const emojifilters = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
            searchResult.forEach((e, i) => {
                if(i < 5) 
                msgcontent += `${emojifilters[i]} ➤ [${e.title}](${e.uri})\n > By: [${e.author.name}](${e.author.ref})\n\n`;
            });
            const reactionfilter = (reaction: MessageReaction, user: User) => {
                if(emojifilters.find(e => e === reaction.emoji.name) && user.id === msg.author.id)
                    return true;
                return false;
            };
            const bot_msg = await msg.channel.send({embed: {
                title: 'Search result 🔍',
                description: msgcontent,
                footer: {text: `${msg.author.tag} 🔍 ${arg0} ${args.join(' ')}`, icon_url: msg.author.displayAvatarURL()},
                timestamp: new Date()
            }
            });
            bot_msg.awaitReactions(reactionfilter, {maxEmojis: 1, time:15000})
            .then(collected => {
                let sel = emojifilters.findIndex( e => e === collected.keyArray()[0]);
                bot_msg.delete();
                if(sel === -1) 
                {
                    msg.channel.send({embed: {
                        title: 'No selected song ⛔',
                        description: `${msg.author.tag} has not selected a song in time.`
                    }});
                    throw new Error('No song chosen within time');
                }
                msg.channel.send({embed: {
                    title: 'Selected song 🎵',
                    description: searchResult[sel].title
                }});
                return sel;
            }).then( (sel) => {
                setTimeout(() => {
                    if(!client.music.has(msg.guild.id)) client.music.set(msg.guild.id, new musicPlayer());
                    client.music.get(msg.guild.id).queue.push(new song(searchResult[sel].title, searchResult[sel].uri));
        
        
                    if(!msg.guild.voice || !msg.guild.voice.connection) msg.member.voice.channel.join()
                    .then( connection => {
                        play_yt(connection, msg, client);
                    });
                }, 500)
            }).catch(console.error);
            try {
                await bot_msg.react(emojifilters[0]);
                await bot_msg.react(emojifilters[1]);
                await bot_msg.react(emojifilters[2]);
                await bot_msg.react(emojifilters[3]);
                await bot_msg.react(emojifilters[4]);
            }
            catch(e) {
                //console.error(e);
                // Error raised when the msg reaction is fulfilled before all react are done.
            }
        }
    },
    security: [],
    aliases : [], 
    parents : [], 
    branches : [],
    category : 'Music', 
    description : '', 
    usage : ['<link | search>'],
    init : (client: musicClient) => {
        client.music = new Collection();
        client.cursong = new Collection();
    },
    //allow_args: (args: string[]) => {return true;},
    }
)
export {cmd};