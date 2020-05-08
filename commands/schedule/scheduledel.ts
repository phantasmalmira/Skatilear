import {command} from '../../handlers/command';
import {schedClient} from './schedule';
import { Message, Collection } from 'discord.js';

const cmd = new command(
    {
    _name: 'del',
    _run: async (client: schedClient, msg: Message, args: string[]) => {
        const schedid = args.shift();
        if(!client.scheduleds.has(msg.guild.id)) client.scheduleds.set(msg.guild.id, new Collection());
        if(!client.scheduleds.get(msg.guild.id).has(schedid)) {
            msg.reply(`${schedid} is not a valid schedule! \`${client.commandprefix}schedule list\` to check list of valid schedid's`);
        }
        else {
            clearInterval(client.scheduleds.get(msg.guild.id).get(schedid));
            client.scheduleds.get(msg.guild.id).delete(schedid);
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
    _init : (client: schedClient) => {}
    }
)
export {cmd};