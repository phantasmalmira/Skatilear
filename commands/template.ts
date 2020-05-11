import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    name: '',
    run: async (client: myClient, msg: Message, args: string[]) => {},
    security: [],
    aliases : [], 
    parents : [], 
    branches : [],
    category : '', 
    description : '', 
    usage : [],
    //init : (client: myClient) => {},
    //allow_args: (args: string[]) => {return true;},
    }
)
export {cmd};