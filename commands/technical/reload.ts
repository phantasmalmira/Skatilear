import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    name: 'reload',
    run: async (client: myClient, msg: Message, args: string[]) => {
        console.log(`Reloading...`);
        const nCmds = client.init_commands();
        msg.channel.send(`Reloaded ${nCmds} commands.`);
        console.log(`Reloaded ${nCmds} commands.`);
    },
    security: ['BOT_OWNER'],
    aliases : [], 
    parents : [], 
    branches : [],
    category : 'Technical', 
    description : '', 
    usage : [],
    //init : (client: myClient) => {},
    //allow_args: (args: string[]) => {return true;},
    }
)
export {cmd};