"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../handlers/command");
const cmd = new command_1.command({
    _name: 'say_child',
    _run: async (client, msg, args) => {
        msg.channel.send('say_child run');
    },
    _security: [],
    _aliases: ['sc'],
    _parents: ['say'],
    _branches: [],
    _category: 'Misc',
    _description: '',
    _usage: ['<abc>', '<bcd>'],
    _init: (client) => { }
});
exports.cmd = cmd;
