"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'list',
    run: async (client, msg, args) => {
        if (!client.scheduleds.has(msg.guild.id))
            client.scheduleds.set(msg.guild.id, new discord_js_1.Collection());
        if (client.scheduleds.get(msg.guild.id).size == 0)
            msg.channel.send(`There are no scheduled tasks.`);
        else {
            let avail_keys = '';
            let keyindex = 1;
            client.scheduleds.get(msg.guild.id).forEach((val, key) => {
                avail_keys += `${keyindex}: ${key}\n`;
                ++keyindex;
            });
            avail_keys = avail_keys.substring(0, avail_keys.length - 1);
            msg.channel.send(`Scheduled tasks: \`\`\`${avail_keys}\`\`\``);
        }
    },
    security: ['ADMINISTRATOR'],
    aliases: [],
    parents: ['schedule'],
    branches: [],
    category: 'Technical',
    description: '',
    usage: [],
});
exports.cmd = cmd;
