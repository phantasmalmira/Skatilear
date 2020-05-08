"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../handlers/command");
const cmd = new command_1.command({
    _name: 'say',
    _run: async (client, msg, args) => {
        const content = args.join(' ');
        msg.channel.send(content);
    },
    _security: [],
    _aliases: [],
    _parents: [],
    _branches: [],
    _category: 'Info',
    _description: '',
    _usage: ['<message>'],
    _init: (client) => { }
});
exports.cmd = cmd;
