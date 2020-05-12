"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'newstop',
    run: async (client, msg, args) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        if (client.guildPlayers.has(msg.guild.id)) {
            const player = client.guildPlayers.get(msg.guild.id);
            player.stop();
            const stopEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Stopped player')
                .setDescription('Guild player had been stopped');
            msg.channel.send(stopEmbed);
        }
        else {
            const noopEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Stop failure 🚫')
                .setDescription('There is no active player currently');
            msg.channel.send(noopEmbed);
        }
    },
    security: [],
    aliases: [],
    parents: [],
    branches: [],
    category: '',
    description: '',
    usage: [],
});
exports.cmd = cmd;
