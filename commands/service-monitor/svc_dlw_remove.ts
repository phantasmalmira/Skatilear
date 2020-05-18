import {command} from '../../handlers/command';
import {MonitorClient, MonitorTask, DLMonitorTask} from './svc_client';
import {ServiceMonitor} from './_service';
import { Message, MessageEmbed, Collection } from 'discord.js';

const cmd = new command(
    {
    name: 'remove',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {
        const svcname = args.shift();
        const reEmbed = new MessageEmbed()
        .setTitle(`Remove Download 🚫`);
        if(!client.guildDLMonitors.has(msg.guild.id) || !client.guildDLMonitors.get(msg.guild.id).has(svcname)) {
            reEmbed.setDescription(`Invalid download, please check ${client.commandprefix}service download list.`);
            msg.channel.send(reEmbed);
            return;
        }
        const mtask = client.guildDLMonitors.get(msg.guild.id).get(svcname);
        clearInterval(mtask.task);
        client.guildDLMonitors.get(msg.guild.id).delete(mtask.name);
        reEmbed.setDescription(`Successfully deleted ${mtask.name} from downloads monitored.`)
        msg.channel.send(reEmbed);
    },
    security: [],
    aliases : [], 
    parents : ['service', 'download'], 
    branches : [],
    category : '', 
    description : '', 
    usage : ['<name>'],
    //init : (client: myClient) => {},
    allow_args: (msg: Message, args: string[]) => {return args.length > 0;},
    }
)
export {cmd};