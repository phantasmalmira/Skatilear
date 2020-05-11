import {command} from '../../handlers/command';
import {schedClient} from './schedule';
import { Message, Collection } from 'discord.js';

const cmd = new command(
    {
    _name: 'list',
    _run: async (client: schedClient, msg: Message, args: string[]) => {
        if(!client.scheduleds.has(msg.guild.id)) client.scheduleds.set(msg.guild.id, new Collection());
        if(client.scheduleds.get(msg.guild.id).size == 0)
            msg.channel.send(`There are no scheduled tasks.`);
        else {
            let avail_keys:string = '';
            let keyindex = 1;
            client.scheduleds.get(msg.guild.id).forEach((val, key) => {
                avail_keys += `${keyindex}: ${key}\n`;
                ++keyindex;
            });
            avail_keys = avail_keys.substring(0, avail_keys.length - 1);
            msg.channel.send(`Scheduled tasks: \`\`\`${avail_keys}\`\`\``);
        }
    },
    _security: ['ADMINISTRATOR'],
    _aliases : [], 
    _parents : ['schedule'], 
    _branches : [],
    _category : 'Technical', 
    _description : '', 
    _usage : [],
    _init : (client: schedClient) => {}
    }
)
export {cmd};