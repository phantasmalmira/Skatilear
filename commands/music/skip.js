"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    _name: 'skip',
    _run: async (client, msg, args) => {
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
    _security: [],
    _aliases: [],
    _parents: [],
    _branches: [],
    _category: 'Music',
    _description: '',
    _usage: [],
    _init: (client) => { }
});
exports.cmd = cmd;
