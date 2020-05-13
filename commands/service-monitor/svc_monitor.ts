import {command} from '../../handlers/command';
import {MonitorClient, MonitorTask} from './svc_client';
import {ServiceMonitor} from './_service';
import { Message, MessageEmbed, Collection } from 'discord.js';

const cmd = new command(
    {
    name: 'monitor',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {
        const name = args.shift();
        const host = args.shift();
        const port = parseInt(args.shift());
        let interval: number;
        let timeout: number;
        if(args.length > 0)
            interval = parseInt(args.shift());
        if(args.length > 0) 
            timeout = parseInt(args.shift());
        
        const mtask = new MonitorTask(name, host, port);
        
        mtask.task = ServiceMonitor.MonitorService([mtask.host, mtask.port], (err, res) => {
            if(err) msg.channel.send(`Error occured during checking service (${mtask.name})`);
            if(res) {
                if(res.changed) {
                    msg.channel.send(`Service (${mtask.name})\nhad gone ${(res.online ? 'Up': 'Down')}`);
                }
            }
        }, {timeout, interval});
        if(!client.guildMonitors.has(msg.guild.id)) client.guildMonitors.set(msg.guild.id, new Collection());
        client.guildMonitors.get(msg.guild.id).set(mtask.name, mtask);
        msg.channel.send(`Successfully added the service monitor\nService: ${mtask.name}\nHost: ${mtask.host}:${mtask.port}`);
    },
    security: [],
    aliases : [], 
    parents : ['service'], 
    branches : [],
    category : 'Network', 
    description : '', 
    usage : ['<service name>', '<host>', '<port>', '<interval?[ms]>','<timeout?[ms]>'],
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
            const interval = parseInt(args[3]);
            if(isNaN(interval)) return false;
            if(interval < 30000) {
                msg.channel.send(`Interval must be at least 30000ms.`);
                return false;
            }
        }
        if(args.length > 4) {
            const timeout = parseInt(args[4]);
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