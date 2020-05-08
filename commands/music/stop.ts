import {command} from '../../handlers/command';
import {musicClient} from './play';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'stop',
    _run: async (client: musicClient, msg: Message, args: string[]) => {
        if(client.music.has(msg.guild.id))
        {
            const player = client.music.get(msg.guild.id);
            if(msg.guild.voice && msg.guild.voice.connection) {
                player.queue.splice(0, player.queue.length);
            }
            player.player.end();
        }
        else {
            msg.reply(`Nothing had ever played.`);
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