import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'del',
    _run: async (client: myClient, msg: Message, args: string[]) => {
        const schedid = args.shift();
        if(!client.scheduleds.has(schedid)) {
            msg.reply(`${schedid} is not a valid schedule! \`${client.commandprefix}schedule list\` to check list of valid schedid's`);
        }
        else {
            clearInterval(client.scheduleds.get(schedid));
            client.scheduleds.delete(schedid);
            msg.reply(`${schedid} had been removed from scheduled tasks successfully.`);
        }

    },
    _security: [],
    _aliases : [], 
    _parents : ['schedule'], 
    _branches : [],
    _category : '', 
    _description : '', 
    _usage : ['<schedid>'],
    _init : (client: myClient) => {}
    }
)
export {cmd};