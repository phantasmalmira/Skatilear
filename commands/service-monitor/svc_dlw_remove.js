"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'remove',
    run: async (client, msg, args) => {
        const svcname = args.shift();
        const reEmbed = new discord_js_1.MessageEmbed()
            .setTitle(`Remove Download 🚫`);
        if (!client.guildDLMonitors.has(msg.guild.id) || !client.guildDLMonitors.get(msg.guild.id).has(svcname)) {
            reEmbed.setDescription(`Invalid download, please check ${client.commandprefix}service download list.`);
            msg.channel.send(reEmbed);
            return;
        }
        const mtask = client.guildDLMonitors.get(msg.guild.id).get(svcname);
        clearInterval(mtask.task);
        client.guildDLMonitors.get(msg.guild.id).delete(mtask.name);
        reEmbed.setDescription(`Successfully deleted ${mtask.name} from downloads monitored.`);
        msg.channel.send(reEmbed);
    },
    security: [],
    aliases: [],
    parents: ['service', 'download'],
    branches: [],
    category: '',
    description: '',
    usage: ['<name>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => { return args.length > 0; },
});
exports.cmd = cmd;
