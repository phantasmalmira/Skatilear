"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    name: 'queue',
    run: async (client, msg, args) => {
        if (client.cursong.has(msg.guild.id)) {
            const cursong = client.cursong.get(msg.guild.id);
            let content = `**Current Track** 🎧\n${cursong.title}\n\n**Up Next** 🎼\n`;
            let playerqueue = client.music.get(msg.guild.id).queue;
            playerqueue.forEach((song, index) => {
                content += `${index}. ${song.title}\n`;
            });
            msg.channel.send({ embed: {
                    title: "Track Queue 🎹",
                    description: content
                } });
        }
        else {
            msg.channel.send(`Not playing a song now.`);
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
