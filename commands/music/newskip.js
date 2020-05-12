"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'newskip',
    run: async (client, msg, args) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        let skipped = false;
        if (client.guildPlayers.has(msg.guild.id)) {
            const player = client.guildPlayers.get(msg.guild.id);
            if (player.nowPlaying) {
                player.dispatcher.end();
                skipped = true;
                await new Promise(resolve => setTimeout(resolve, 500));
                let nowplaying;
                if (player.nowPlaying)
                    nowplaying = player.nowPlaying.title;
                else
                    nowplaying = 'Nothing';
                const skippedEmbed = new discord_js_1.MessageEmbed()
                    .setTitle('Skipped Song 🎵 Now playing ')
                    .setDescription(`${nowplaying}`);
                msg.channel.send(skippedEmbed);
            }
        }
        if (!skipped) {
            const noopEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Skip failure 🚫')
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
