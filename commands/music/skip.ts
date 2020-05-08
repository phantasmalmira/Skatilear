import {command} from '../../handlers/command';
import {musicClient, musicPlayer} from './play';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'skip',
    _run: async (client: musicClient, msg: Message, args: string[]) => {
        if(client.music.has(msg.guild.id))
        {
            const player = client.music.get(msg.guild.id);
            if(player.player) player.player.end();
            else msg.reply(`Nothing is playing right now!`);
        }
        else {
            msg.reply('Nothing has ever played!');
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