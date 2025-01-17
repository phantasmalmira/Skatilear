import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    name: 'say',
    run: async (client: myClient, msg: Message, args: string[]) => {
        const content = args.join(' ');
        msg.channel.send(content);
    },
    security: [],
    aliases : [], 
    parents : [], 
    branches : [],
    category : 'Info', 
    description : '', 
    usage : ['<message>'],
    //init : (client: myClient) => {},
    allow_args: (msg: Message, args: string[]) => {return args.length >= 1;},
    }
)
export {cmd};