"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../handlers/command");
const cmd = new command_1.command({
    name: 'say_child',
    run: async (client, msg, args) => {
        msg.channel.send('say_child run');
    },
    security: ['DISABLED'],
    aliases: ['sc'],
    parents: ['say'],
    branches: [],
    category: 'Misc',
    description: '',
    usage: ['<abc>', '<bcd>'],
    init: (client) => { }
});
exports.cmd = cmd;
