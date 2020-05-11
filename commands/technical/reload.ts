import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'reload',
    _run: async (client: myClient, msg: Message, args: string[]) => {
        console.log(`Reloading...`);
        const nCmds = client.init_commands();
        msg.channel.send(`Reloaded ${nCmds} commands.`);
        console.log(`Reloaded ${nCmds} commands.`);
    },
    _security: ['BOT_OWNER'],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : 'Technical', 
    _description : '', 
    _usage : [],
    _init : (client: myClient) => {}
    }
)
export {cmd};