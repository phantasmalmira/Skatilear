import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'prefix',
    _run: async (client: myClient, msg: Message, args: string[]) => {
        const newprefix = args.shift();
        msg.channel.send(`Changed prefix from ${client.commandprefix} to ${newprefix}.`);
        client.settings.setGlobalSetting('cmdprefix', newprefix);
        client.commandprefix = newprefix;
    },
    _security: [],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : 'Technical', 
    _description : '', 
    _usage : ['<newprefix>'],
    _init : (client: myClient) => {
        const prefix = client.settings.getGlobalSetting('cmdprefix');
        if(prefix)
        {
            console.log(`Changed prefix from ${client.commandprefix} to ${prefix}`);
            client.commandprefix = prefix;
        }
    }
    }
)
export {cmd};