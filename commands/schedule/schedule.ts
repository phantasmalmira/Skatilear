import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message, Collection } from 'discord.js';

interface schedClient extends myClient {
    scheduleds: Collection<string, Collection<string, NodeJS.Timer>>;
}
export {schedClient};

const cmd = new command(
    {
    _name: 'schedule',
    _run: async (client: schedClient, msg: Message, args: string[]) => {},
    _security: [],
    _aliases : ['sched'], 
    _parents : [], 
    _branches : [],
    _category : '', 
    _description : '', 
    _usage : ['<action: add | del | list>'],
    _init : (client: schedClient) => {
        client.scheduleds = new Collection<string, Collection<string, NodeJS.Timer>>()
    }
    }
)
export {cmd};