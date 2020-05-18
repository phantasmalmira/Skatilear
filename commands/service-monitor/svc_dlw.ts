import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message, MessageEmbed } from 'discord.js';

const cmd = new command(
    {
    name: 'download',
    run: async (client: myClient, msg: Message, args: string[]) => {},
    security: [],
    aliases : ['dlw'], 
    parents : ['service'], 
    branches : [],
    category : '', 
    description : '', 
    usage : ['<action: check | monitor>'],
    //init : (client: myClient) => {},
    allow_args: (msg: Message, args: string[]) => {return false;},
    }
)
export {cmd};