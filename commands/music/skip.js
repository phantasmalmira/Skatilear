"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    name: 'skip',
    run: async (client, msg, args) => {
        if (client.music.has(msg.guild.id)) {
            const player = client.music.get(msg.guild.id);
            if (player.player)
                player.player.end();
            else
                msg.reply(`Nothing is playing right now!`);
        }
        else {
            msg.reply('Nothing has ever played!');
        }
    },
    security: [],
    aliases: [],
    parents: [],
    branches: [],
    category: 'Music',
    description: '',
    usage: [],
    init: (client) => { }
});
exports.cmd = cmd;
