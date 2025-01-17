"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'del',
    run: async (client, msg, args) => {
        const schedid = args.shift();
        if (!client.scheduleds.has(msg.guild.id))
            client.scheduleds.set(msg.guild.id, new discord_js_1.Collection());
        if (!client.scheduleds.get(msg.guild.id).has(schedid)) {
            msg.reply(`${schedid} is not a valid schedule! \`${client.commandprefix}schedule list\` to check list of valid schedid's`);
        }
        else {
            clearInterval(client.scheduleds.get(msg.guild.id).get(schedid));
            client.scheduleds.get(msg.guild.id).delete(schedid);
            msg.reply(`${schedid} had been removed from scheduled tasks successfully.`);
        }
    },
    security: ['ADMINISTRATOR'],
    aliases: [],
    parents: ['schedule'],
    branches: [],
    category: 'Technical',
    description: '',
    usage: ['<schedid>'],
    //init : (client: schedClient) => {},
    allow_args: (msg, args) => { return args.length > 0; },
});
exports.cmd = cmd;
