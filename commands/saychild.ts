import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'say_child',
    _run: async (client: myClient, msg: Message, args: string[]) => {
        msg.channel.send('say_child run');
    },
    _security: [],
    _aliases : ['sc'], 
    _parents : ['say'], 
    _branches : [],
    _category : 'Misc', 
    _description : '', 
    _usage : ['<abc>', '<bcd>'],
    _init : (client: myClient) => {}
    }
)
export {cmd};