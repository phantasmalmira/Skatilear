import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    name: 'prefix',
    run: async (client: myClient, msg: Message, args: string[]) => {
        const newprefix = args.shift();
        msg.channel.send(`Changed prefix from ${client.commandprefix} to ${newprefix}.`);
        client.settings.setGlobalSetting('cmdprefix', newprefix);
        client.commandprefix = newprefix;
    },
    security: [],
    aliases : [], 
    parents : [], 
    branches : [],
    category : 'Technical', 
    description : '', 
    usage : ['<newprefix>'],
    init : (client: myClient) => {
        const prefix = client.settings.getGlobalSetting('cmdprefix');
        if(prefix)
        {
            console.log(`Changed prefix from ${client.commandprefix} to ${prefix}`);
            client.commandprefix = prefix;
        }
    },
    //allow_args: (args: string[]) => {return true;},
    }
)
export {cmd};