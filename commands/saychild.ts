import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    name: 'say_child',
    run: async (client: myClient, msg: Message, args: string[]) => {
        msg.channel.send('say_child run');
    },
    security: ['DISABLED'],
    aliases : ['sc'], 
    parents : ['say'], 
    branches : [],
    category : 'Misc', 
    description : '', 
    usage : ['<abc>', '<bcd>'],
    // init : (client: myClient) => {},
    // allow_args: (args: string[]) => {return true;},
    }
)
export {cmd};