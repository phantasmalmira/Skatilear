import {command} from '../../../handlers/command';
import {myClient} from '../../../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    name: 'del',
    run: async (client: myClient, msg: Message, args: string[]) => {
        const alias = args.shift();
        if(client.aliases.has(msg.guild.id) && client.aliases.get(msg.guild.id).has(alias)) {
            const aliasfcmd = client.aliases.get(msg.guild.id).get(alias);
            const aliasdb = client.db.db(msg.guild.id, {traversepath: ['aliases']});
            if(aliasdb.delete({alias: alias, fcmd: aliasfcmd}))
            {   
                msg.reply(`Successfully deleted ${alias}.`);
                client.aliases.get(msg.guild.id).delete(alias);
            }
            else {
                msg.reply(`Error occured during delete of ${alias}.`);
            }
        }
        else {
            msg.reply(`\`${alias}\` is not an alias, check ${client.commandprefix}alias list.`);
        }
    },
    security: ['MANAGE_GUILD'],
    aliases : [], 
    parents : ['alias'], 
    branches : [],
    category : 'Alias', 
    description : '', 
    usage : ['<alias>'],
    //init : (client: myClient) => {},
    allow_args: (msg: Message, args: string[]) => {return args.length >= 1;},
    }
)
export {cmd};