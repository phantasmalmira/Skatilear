import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message, Collection, StreamDispatcher, VoiceConnection } from 'discord.js';
import * as ytdl from 'ytdl-core';

interface musicClient extends myClient {
    music: Collection<string, musicPlayer>;
}

interface musicPlayer {
    player: StreamDispatcher;
    queue: any[];
}

class musicPlayer {
    constructor() {
        this.player = null;
        this.queue = [];
    }
}

export{musicClient, musicPlayer};

const ytpattern = RegExp('^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$');

const play_yt = (conn: VoiceConnection, msg: Message, client: musicClient) => {
    let player = client.music.get(msg.guild.id);
    player.player = conn.play(ytdl(player.queue[0], {filter:"audioonly"}));
    player.queue.shift();
    player.player.on('finish', () => {
        if(player.queue[0]) {
            play_yt(conn, msg, client);
        }
        else {
            conn.disconnect();
        }
    });
};

const cmd = new command(
    {
    _name: 'play',
    _run: async (client: musicClient, msg: Message, args: string[]) => {
        if(!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        const arg0 = args.shift();
        //if(ytpattern.test(arg0))
        //{
            if(!client.music.has(msg.guild.id)) client.music.set(msg.guild.id, new musicPlayer());
            client.music.get(msg.guild.id).queue.push(arg0);


            if(!msg.guild.voice || !msg.guild.voice.connection) msg.member.voice.channel.join()
            .then( connection => {
                play_yt(connection, msg, client);
            });
        //}
    },
    _security: [],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : 'Music', 
    _description : '', 
    _usage : ['<link | search>'],
    _init : (client: musicClient) => {
        client.music = new Collection();
    }
    }
)
export {cmd};