import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'schedule',
    _run: async (client: myClient, msg: Message, args: string[]) => {},
    _security: [],
    _aliases : ['sched'], 
    _parents : [], 
    _branches : [],
    _category : '', 
    _description : '', 
    _usage : ['<action: add | del | list>'],
    _init : (client: myClient) => {}
    }
)
export {cmd};