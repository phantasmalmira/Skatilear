"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'remove',
    run: async (client, msg, args) => {
        const svcname = args.shift();
        const reEmbed = new discord_js_1.MessageEmbed()
            .setTitle(`Remove Service 🚫`);
        if (!client.guildMonitors.has(msg.guild.id) || !client.guildMonitors.get(msg.guild.id).has(svcname)) {
            reEmbed.setDescription(`Invalid service, please check ${client.commandprefix}service list.`);
            msg.channel.send(reEmbed);
            return;
        }
        const mtask = client.guildMonitors.get(msg.guild.id).get(svcname);
        clearInterval(mtask.task);
        client.guildMonitors.get(msg.guild.id).delete(mtask.name);
        reEmbed.setDescription(`Successfully deleted ${mtask.name} from services monitored.`);
        msg.channel.send(reEmbed);
    },
    security: [],
    aliases: [],
    parents: ['service'],
    branches: [],
    category: 'Network',
    description: '',
    usage: ['<service name>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => {
        return args.length >= 1;
    },
});
exports.cmd = cmd;
