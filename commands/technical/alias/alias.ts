import {command} from '../../../handlers/command';
import {myClient} from '../../../index';
import { Message, Collection } from 'discord.js';

const cmd = new command(
    {
    name: 'alias',
    run: async (client: myClient, msg: Message, args: string[]) => {},
    security: [],
    aliases : [], 
    parents : [], 
    branches : [],
    category : 'Alias', 
    description : '', 
    usage : ['<action : add | del | list>'],
    init : (client: myClient) => {
        const aliasdb = client.db.dbsInTraverse(['aliases']);
        client.aliases.clear();
        aliasdb.forEach((guild) => {
            if(!client.aliases.has(guild.cname)) client.aliases.set(guild.cname, new Collection());
            guild.forEach((item) => {
                client.aliases.get(guild.cname).set(item.alias, item.fcmd); 
            });
        });
    },
    allow_args: (msg: Message, args: string[]) => {return false;},
    }
)
export {cmd};