"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'newqueue',
    run: async (client, msg, args) => {
        let playing = false;
        if (client.guildPlayers.has(msg.guild.id)) {
            const player = client.guildPlayers.get(msg.guild.id);
            if (player.nowPlaying) {
                playing = true;
                let description = `**Current Track** 🎧\n${player.nowPlaying.title}\n\n**Up Next** 🎶\n`;
                player.queue.forEach((song, index) => {
                    description += `${index}. ${song.title}\n`;
                });
                const queueEmbed = new discord_js_1.MessageEmbed()
                    .setTitle('Track Queue 🎹')
                    .setDescription(description);
                msg.channel.send(queueEmbed);
            }
        }
        if (!playing) {
            const noopEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Track Queue 🎹')
                .setDescription('Nothing is playing currently');
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
