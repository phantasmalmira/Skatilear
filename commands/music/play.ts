import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message, Collection } from 'discord.js';

interface musicClient extends myClient {
    music: Collection<string, string>;
}

const ytpattern = RegExp('^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$');

const cmd = new command(
    {
    _name: 'play',
    _run: async (client: musicClient, msg: Message, args: string[]) => {
        if(!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        if(!msg.guild.voice.connection) msg.member.voice.channel.join()
        .then( connection => {



        });
        const arg0 = args.shift();
        if(ytpattern.test(arg0)) // is a youtube link
        {

        }
    },
    _security: [],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : '', 
    _description : '', 
    _usage : ['<link | search>'],
    _init : (client: musicClient) => {}
    }
)
export {cmd};