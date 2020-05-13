"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'list',
    run: async (client, msg, args) => {
        const msgEmbed = new discord_js_1.MessageEmbed()
            .setTitle('Services Monitored 📶');
        if (!client.guildMonitors.has(msg.guild.id) || client.guildMonitors.get(msg.guild.id).size === 0) {
            msgEmbed.setDescription(`No services are monitored in this guild.`);
            msg.channel.send(msgEmbed);
            return;
        }
        let msgcontent = '';
        let index = 1;
        for (const svc of client.guildMonitors.get(msg.guild.id).values()) {
            msgcontent += `${index}. ${svc.name} || ${svc.host}:${svc.port}\n`;
            ++index;
        }
        msgEmbed.setDescription(msgcontent);
        msg.channel.send(msgEmbed);
    },
    security: [],
    aliases: [],
    parents: ['service'],
    branches: [],
    category: 'Network',
    description: '',
    usage: [],
});
exports.cmd = cmd;
