import {command} from '../../handlers/command';
import {musicClient} from './play';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'queue',
    _run: async (client: musicClient, msg: Message, args: string[]) => {
        if(client.cursong.has(msg.guild.id)) { 
            const cursong = client.cursong.get(msg.guild.id);
            let content = `**Current Track** 🎧\n${cursong.title}\n\n**Up Next** 🎼\n`;
            let playerqueue = client.music.get(msg.guild.id).queue;
            playerqueue.forEach( (song, index) => {
                content += `${index}. ${song.title}\n`;
            });
            msg.channel.send({embed: {
                title: "Track Queue 🎹",
                description: content
            }});
        } else {
            msg.channel.send(`Not playing a song now.`);
        }
    },
    _security: [],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : 'Music', 
    _description : '', 
    _usage : [],
    _init : (client: musicClient) => {}
    }
)
export {cmd};