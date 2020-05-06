import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'say',
    _run: async (client: myClient, msg: Message, args: string[]) => {},
    _security: [],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : '', 
    _description : '', 
    _usage : [],
    _init : (client: myClient) => {}
    }
)
export {cmd};