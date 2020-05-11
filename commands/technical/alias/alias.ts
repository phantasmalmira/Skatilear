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
        const aliasdb = client.db.db('aliases', {});
        aliasdb.forEach((item) => {
            client.aliases.set(item.alias, item.fcmd); 
        });
    }
    }
)
export {cmd};