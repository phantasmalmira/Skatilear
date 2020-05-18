import {command} from '../../handlers/command';
import {MonitorClient, MonitorTask, DLMonitorTask} from './svc_client';
import {ServiceMonitor} from './_service';
import { Message, MessageEmbed, Collection } from 'discord.js';

const cmd = new command(
    {
    name: 'check',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {
        const name = args.shift();
        const url = args.shift();
        ServiceMonitor.downloadCheck(url, (err, res) =>{
            if(err) {
                msg.channel.send(`Error occured during checking download link.\`\`\`${err}\`\`\``);
                return;
            }
            if(res.statuscode == 200) {
                const content_len = parseInt(res.headers["content-length"]);
                const embed = new MessageEmbed()
                .setTitle(`Download Link **(${name})**`)
                .setDescription(`Download available\nSize: ${(content_len / (1024 * 1024)).toFixed(2)}mb\n[Click here to download](${url})`)
                .setFooter(`${name} | ${url}`)
                .setColor('#2ae85d')
                .setTimestamp(new Date());
                msg.channel.send(embed);
            } else if(res.statuscode == 404) {
                const embed = new MessageEmbed()
                .setTitle(`Download Link **(${name})**`)
                .setDescription(`Download not available...`)
                .setFooter(`${name} | ${url}`)
                .setColor('#eb2d36')
                .setTimestamp(new Date());
                msg.channel.send(embed);
            }
        });
    },
    security: [],
    aliases : [], 
    parents : ['service', 'download'], 
    branches : [],
    category : '', 
    description : '', 
    usage : ['<name>', '<url>'],
    //init : (client: myClient) => {},
    allow_args: (msg: Message, args: string[]) => {
        if (args.length < 2) return false;
        if (!ServiceMonitor.isUrl(args[1])) {
            msg.channel.send('URL is not valid.')
            return false;
        }
        return true;
    },
    }
)
export {cmd};