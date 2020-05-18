"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const svc_client_1 = require("./svc_client");
const _service_1 = require("./_service");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'monitor',
    run: async (client, msg, args) => {
        const name = args.shift();
        const host = args.shift();
        const port = parseInt(args.shift());
        let interval;
        let timeout;
        let c_msg = '';
        if (args.length > 0)
            interval = parseInt(args.shift());
        if (args.length > 0)
            timeout = parseInt(args.shift());
        if (args.length > 0)
            c_msg = args.join(' ');
        const mtask = new svc_client_1.MonitorTask(name, host, port);
        mtask.task = _service_1.ServiceMonitor.MonitorService([mtask.host, mtask.port], (err, res) => {
            if (err) {
                msg.channel.send(`Error occured during checking service (${mtask.name})\`\`\`${err}\`\`\``);
                return;
            }
            if (res) {
                if (res.changed) {
                    const uptime_hr = Math.trunc((res.ms_sinceChange / (1000 * 60 * 60))).toString().padStart(2, '0');
                    const uptime_min = Math.trunc((res.ms_sinceChange / (1000 * 60)) % 60).toString().padStart(2, '0');
                    const uptime_sec = Math.trunc((res.ms_sinceChange / (1000)) % 60).toString().padStart(2, '0');
                    const embed = new discord_js_1.MessageEmbed()
                        .setTitle(`Service **(${mtask.name})**`)
                        .setDescription(`*${mtask.name}* had gone **${(res.online ? 'Up' : 'Down')}**\n${(res.online ? 'Down' : 'Up')}-time: ${uptime_hr}:${uptime_min}:${uptime_sec}`)
                        .setFooter(`${mtask.name} | ${mtask.host}:${mtask.port}`)
                        .setTimestamp(new Date());
                    if (res.online)
                        embed.setColor('#2ae85d');
                    else
                        embed.setColor('#eb2d36');
                    msg.channel.send(c_msg, embed);
                }
            }
        }, { timeout, interval });
        if (!client.guildMonitors.has(msg.guild.id))
            client.guildMonitors.set(msg.guild.id, new discord_js_1.Collection());
        client.guildMonitors.get(msg.guild.id).set(mtask.name, mtask);
        const infoembed = new discord_js_1.MessageEmbed()
            .setTitle(`Service Added 📶`)
            .setDescription(`**${mtask.name}** is now monitored every ${Math.trunc((interval || 30000) / 1000)}s.\nHost: \`${mtask.host}:${mtask.port}\`\n`);
        msg.channel.send(infoembed);
    },
    security: [],
    aliases: [],
    parents: ['service'],
    branches: [],
    category: 'Network',
    description: '',
    usage: ['<service name>', '<host>', '<port>', '<interval?[ms]>', '<timeout?[ms]>', '<...msg_changed?>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => {
        if (args.length < 3)
            return false;
        const port = parseInt(args[2]);
        if (isNaN(port))
            return false;
        if (port < 0 || port > 65535) {
            msg.channel.send('Port number must be from 0 - 65535');
            return false;
        }
        if (args.length > 3) {
            const interval = parseInt(args[3]);
            if (isNaN(interval))
                return false;
            if (interval < 10000) {
                msg.channel.send(`Interval must be at least 10000ms.`);
                return false;
            }
        }
        if (args.length > 4) {
            const timeout = parseInt(args[4]);
            if (isNaN(timeout))
                return false;
            if (timeout < 1500 || timeout > 15000) {
                msg.channel.send(`Timeout must be 1500 - 15000ms`);
                return false;
            }
        }
        return true;
    },
});
exports.cmd = cmd;
