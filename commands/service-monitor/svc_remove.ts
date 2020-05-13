import {command} from '../../handlers/command';
import {MonitorClient} from './svc_client';
import {ServiceMonitor} from './_service';
import { Message, MessageEmbed } from 'discord.js';

const cmd = new command(
    {
    name: 'remove',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {
        const svcname = args.shift();
        const reEmbed = new MessageEmbed()
        .setTitle(`Remove Service 🚫`);
        if(!client.guildMonitors.has(msg.guild.id) || !client.guildMonitors.get(msg.guild.id).has(svcname)) {
            reEmbed.setDescription(`Invalid service, please check ${client.commandprefix}service list.`);
            msg.channel.send(reEmbed);
            return;
        }
        const mtask = client.guildMonitors.get(msg.guild.id).get(svcname);
        clearInterval(mtask.task);
        client.guildMonitors.get(msg.guild.id).delete(mtask.name);
        reEmbed.setDescription(`Successfully deleted ${mtask.name} from services monitored.`)
        msg.channel.send(reEmbed);
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