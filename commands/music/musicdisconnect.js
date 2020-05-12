"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'disconnect',
    run: async (client, msg, args) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        let disconnected = false;
        if (client.guildPlayers.has(msg.guild.id)) {
            const player = client.guildPlayers.get(msg.guild.id);
            if (player.v_connection.status !== 4) {
                player.disconnect();
                disconnected = true;
                const actEmbed = new discord_js_1.MessageEmbed()
                    .setTitle('Disconnected 🔈')
                    .setDescription('Guild player is disconnected');
                msg.channel.send(actEmbed);
            }
        }
        if (!disconnected) {
            const noopEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Disconnect failure 🚫')
                .setDescription('There is no active player currently');
            msg.channel.send(noopEmbed);
        }
    },
    security: [],
    aliases: [],
    parents: [],
    branches: [],
    category: 'Music',
    description: '',
    usage: [],
});
exports.cmd = cmd;
