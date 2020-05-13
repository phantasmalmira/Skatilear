import {command} from '../../handlers/command';
import {MonitorClient} from './svc_client';
import {ServiceMonitor} from './_service';
import { Message, MessageEmbed } from 'discord.js';

const cmd = new command(
    {
    name: 'check',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {
        const name = args.shift();
        const host = args.shift();
        const port = parseInt(args.shift());
        let timeout: number;
        if(args.length > 0) {
            timeout = parseInt(args.shift());
        }
        ServiceMonitor.CheckService([host, port], {timeout: timeout})
        .then( res => {
            const embed = new MessageEmbed()
            .setTitle(`Service **(${name})**`)
            .setDescription(`*${name}* is now **${(res.online ? 'Up': 'Down')}**`)
            .setFooter(`${name} | ${res.host}:${res.port}`)
            .setTimestamp(new Date());
            if(res.online)
                embed.setColor('#2ae85d');
            else
                embed.setColor('#eb2d36');
            msg.channel.send(embed);
        })
        .catch( e => {
            msg.channel.send(`Error occured during check:\`\`\`${e}\`\`\``);
        });
    },
    security: [],
    aliases : [], 
    parents : ['service'], 
    branches : [],
    category : 'Network', 
    description : '', 
    usage : ['<service name>', '<host>', '<port>', '<timeout?[ms]>'],
    //init : (client: myClient) => {},
    allow_args: (msg: Message, args: string[]) => {
        if(args.length < 3) return false;
        const port = parseInt(args[2]);
        if(isNaN(port)) return false;
        if(port < 0 || port > 65535 ) 
        {
            msg.channel.send('Port number must be from 0 - 65535');
            return false;
        }
        if(args.length > 3) {
            const timeout = parseInt(args[3]);
            if(isNaN(timeout)) return false;
            if(timeout < 1500 || timeout > 15000) 
            {
                msg.channel.send(`Timeout must be 1500 - 15000ms`);
                return false;
            }
        }
        return true;
    },
    }
)
export {cmd};