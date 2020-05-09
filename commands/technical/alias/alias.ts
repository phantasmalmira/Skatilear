import {command} from '../../../handlers/command';
import {myClient} from '../../../index';
import { Message, Collection } from 'discord.js';

const cmd = new command(
    {
    _name: 'alias',
    _run: async (client: myClient, msg: Message, args: string[]) => {
        
    },
    _security: [],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : 'Alias', 
    _description : '', 
    _usage : ['<action : add | del | list>'],
    _init : (client: myClient) => {
        const aliasdb = client.db.db('aliases', {});
        aliasdb.forEach((item) => {
            client.aliases.set(item.alias, item.fcmd); 
        });
    }
    }
)
export {cmd};