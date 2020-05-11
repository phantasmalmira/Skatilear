"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    _name: 'list',
    _run: async (client, msg, args) => {
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
    _security: ['ADMINISTRATOR'],
    _aliases: [],
    _parents: ['schedule'],
    _branches: [],
    _category: 'Technical',
    _description: '',
    _usage: [],
    _init: (client) => { }
});
exports.cmd = cmd;
