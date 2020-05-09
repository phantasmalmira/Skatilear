import {command} from '../../../handlers/command';
import {myClient} from '../../../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'del',
    _run: async (client: myClient, msg: Message, args: string[]) => {
        const alias = args.shift();
        if(client.aliases.has(alias)) {
            const aliasfcmd = client.aliases.get(alias);
            const aliasdb = client.db.db('aliases', {});
            if(aliasdb.delete({alias: alias, fcmd: aliasfcmd}))
            {   
                msg.reply(`Successfully deleted ${alias}.`);
                client.aliases.delete(alias);
            }
            else {
                msg.reply(`Error occured during delete of ${alias}.`);
            }
        }
        else {
            msg.reply(`\`${alias}\` is not an alias, check ${client.commandprefix}alias list.`);
        }
    },
    _security: [],
    _aliases : [], 
    _parents : ['alias'], 
    _branches : [],
    _category : '', 
    _description : '', 
    _usage : ['<alias>'],
    _init : (client: myClient) => {}
    }
)
export {cmd};