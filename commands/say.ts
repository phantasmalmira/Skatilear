import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'say',
    _run: async (client: myClient, msg: Message, args: string[]) => {
        const content = args.join(' ');
        msg.channel.send(content);
    },
    _security: [],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : 'Info', 
    _description : '', 
    _usage : ['<message>'],
    _init : (client: myClient) => {}
    }
)
export {cmd};