import {command} from '../../handlers/command';
import {MonitorClient, MonitorTask, DLMonitorTask} from './svc_client';
import {ServiceMonitor} from './_service';
import { Message, MessageEmbed, Collection } from 'discord.js';

const cmd = new command(
    {
    name: 'monitor',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {
        const name = args.shift();
        const url = args.shift();
        let interval: number;
        let c_msg = '';
        if(args.length > 0)
            interval = parseInt(args.shift());
        if(args.length > 0)
            c_msg = args.join(' ');
        if(!client.guildDLMonitors.has(msg.guild.id)) client.guildDLMonitors.set(msg.guild.id, new Collection());

        const dltask = new DLMonitorTask(name, url);
        client.guildDLMonitors.get(msg.guild.id).set(dltask.name, dltask);
        let lastresponse: number;
        dltask.task = ServiceMonitor.downloadMonitor(dltask.url, (err, res) => {
            if(err) {
                msg.channel.send(`Error occured during monitoring download (${dltask.name})\`\`\`${err}\`\`\``);
                return;
            }
            if(!lastresponse) lastresponse = res.statuscode;
            if(lastresponse !== res.statuscode) {
                lastresponse = res.statuscode;
                if(res.statuscode == 200) {
                    const content_len = parseInt(res.headers["content-length"]);
                    const embed = new MessageEmbed()
                    .setTitle(`Download ${dltask.name}`)
                    .setDescription(`Download available\nSize: ${(content_len / (1024 * 1024)).toFixed(2)}mb\n[Click here to download](${dltask.url})`)
                    .setFooter(`${dltask.name} | ${dltask.url}`)
                    .setColor('#2ae85d')
                    .setTimestamp(new Date());
                    msg.channel.send(c_msg, embed);
                } else if(res.statuscode == 404) {
                    const embed = new MessageEmbed()
                    .setTitle(`Download ${dltask.name}`)
                    .setDescription(`Download no longer available...`)
                    .setFooter(`${dltask.name} | ${dltask.url}`)
                    .setColor('#eb2d36')
                    .setTimestamp(new Date());
                    msg.channel.send(c_msg, embed);
                }
             }
        }, {interval_ms: interval});

        const infoembed = new MessageEmbed()
        .setTitle(`Download Added 📶`)
        .setDescription(`**${dltask.name}** is now monitored every ${Math.trunc((interval || 30000)/ 1000)}s.`);
        msg.channel.send(infoembed);
    },
    security: [],
    aliases : [], 
    parents : ['service', 'download'], 
    branches : [],
    category : '', 
    description : '', 
    usage : ['<name>', '<url>', '<interval?[ms]>', '<...msg?>'],
    //init : (client: myClient) => {},
    allow_args: (msg: Message, args: string[]) => {
        if (args.length < 2) return false;
        if (!ServiceMonitor.isUrl(args[1])) {
            msg.channel.send('URL is not valid.');
            return false;
        }
        if (args.length > 2) {
            const ms = parseInt(args[2]);
            if(isNaN(ms)) return false;
            if(ms < 15000) {
                msg.channel.send('Interval must be at least 15000ms.');
                return false;
            }
        }
        return true;
    },
    }
)
export {cmd};