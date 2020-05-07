import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'list',
    _run: async (client: myClient, msg: Message, args: string[]) => {
        if(client.scheduleds.size == 0)
            msg.channel.send(`There are no scheduled tasks.`);
        else {
            let avail_keys:string = '';
            let keyindex = 1;
            client.scheduleds.forEach((val, key) => {
                avail_keys += `${keyindex}: ${key}\n`;
                ++keyindex;
            });
            avail_keys = avail_keys.substring(0, avail_keys.length - 1);
            msg.channel.send(`Scheduled tasks: \`\`\`${avail_keys}\`\`\``);
        }
    },
    _security: [],
    _aliases : [], 
    _parents : ['schedule'], 
    _branches : [],
    _category : '', 
    _description : '', 
    _usage : [],
    _init : (client: myClient) => {}
    }
)
export {cmd};