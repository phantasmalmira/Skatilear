import {command} from '../../handlers/command';
import {MonitorClient} from './svc_client';
import {ServiceMonitor} from './_service';
import { Message, MessageEmbed } from 'discord.js';

const cmd = new command(
    {
    name: 'remove',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {
        const svcname = args.shift();
        if(!client.guildMonitors.has(msg.guild.id) || !client.guildMonitors.get(msg.guild.id).has(svcname)) {
            msg.channel.send(`Invalid service, please check ${client.commandprefix}service list.`);
            return;
        }
        const mtask = client.guildMonitors.get(msg.guild.id).get(svcname);
        clearInterval(mtask.task);
        client.guildMonitors.get(msg.guild.id).delete(mtask.name);
        msg.channel.send(`Successfully deleted ${mtask.name} from services monitored.`);
    },
    security: [],
    aliases : [], 
    parents : ['service'], 
    branches : [],
    category : 'Network', 
    description : '', 
    usage : ['<service name>'],
    //init : (client: myClient) => {},
    allow_args: (msg: Message, args: string[]) => {
        return args.length >= 1;
    },
    }
)
export {cmd};