"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    _name: 'stop',
    _run: async (client, msg, args) => {
        if (client.music.has(msg.guild.id)) {
            const player = client.music.get(msg.guild.id);
            if (msg.guild.voice && msg.guild.voice.connection) {
                player.queue.splice(0, player.queue.length);
            }
            player.player.end();
        }
        else {
            msg.reply(`Nothing had ever played.`);
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