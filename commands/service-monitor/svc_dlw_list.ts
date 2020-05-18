import {command} from '../../handlers/command';
import {MonitorClient, MonitorTask, DLMonitorTask} from './svc_client';
import {ServiceMonitor} from './_service';
import { Message, MessageEmbed, Collection } from 'discord.js';

const cmd = new command(
    {
    name: 'list',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {
        const msgEmbed = new MessageEmbed()
        .setTitle('Downloads Monitored 📶')
        if(!client.guildDLMonitors.has(msg.guild.id) || client.guildDLMonitors.get(msg.guild.id).size === 0){
            msgEmbed.setDescription(`No downloads are monitored in this guild.`);
            msg.channel.send(msgEmbed);
            return;
        }
        let msgcontent = '';
        let index = 1;
        for(const svc of client.guildDLMonitors.get(msg.guild.id).values()) {
            msgcontent += `${index}. ${svc.name} || ${svc.url}\n`;
            ++index;
        }
        msgEmbed.setDescription(msgcontent);
        msg.channel.send(msgEmbed);
    },
    security: [],
    aliases : [], 
    parents : ['service', 'download'], 
    branches : [],
    category : '', 
    description : '', 
    usage : [],
    //init : (client: myClient) => {},
    //allow_args: (msg: Message, args: string[]) => {return true;},
    }
)
export {cmd};