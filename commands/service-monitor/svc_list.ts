import {command} from '../../handlers/command';
import {MonitorClient} from './svc_client';
import {ServiceMonitor} from './_service';
import { Message, MessageEmbed } from 'discord.js';

const cmd = new command(
    {
    name: 'list',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {
        const msgEmbed = new MessageEmbed()
        .setTitle('Services Monitored 📶')
        if(!client.guildMonitors.has(msg.guild.id) || client.guildMonitors.get(msg.guild.id).size === 0) {
            msgEmbed.setDescription(`No services are monitored in this guild.`);
            msg.channel.send(msgEmbed);
            return;
        }
        let msgcontent = '';
        let index = 1;
        for(const svc of client.guildMonitors.get(msg.guild.id).values()) {
            msgcontent += `${index}. ${svc.name} || ${svc.host}:${svc.port}\n`;
            ++index;
        }
        msgEmbed.setDescription(msgcontent);
        msg.channel.send(msgEmbed);
    },
    security: [],
    aliases : [], 
    parents : ['service'], 
    branches : [],
    category : 'Network', 
    description : '', 
    usage : [],
    //init : (client: myClient) => {},
    //allow_args: (msg: Message, args: string[]) => {return true},
    }
)
export {cmd};