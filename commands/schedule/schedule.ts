import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message, Collection } from 'discord.js';

interface schedClient extends myClient {
    scheduleds: Collection<string, Collection<string, NodeJS.Timer>>;
}
export {schedClient};

const cmd = new command(
    {
    name: 'schedule',
    run: async (client: schedClient, msg: Message, args: string[]) => {},
    security: [],
    aliases : ['sched'], 
    parents : [], 
    branches : [],
    category : 'Technical', 
    description : '', 
    usage : ['<action: add | del | list>'],
    init : (client: schedClient) => {
        client.scheduleds = new Collection<string, Collection<string, NodeJS.Timer>>()
    },
    allow_args: (msg: Message, args: string[]) => {return false;},
    }
)
export {cmd};