"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../handlers/command");
const cmd = new command_1.command({
    name: 'say',
    run: async (client, msg, args) => {
        const content = args.join(' ');
        msg.channel.send(content);
    },
    security: [],
    aliases: [],
    parents: [],
    branches: [],
    category: 'Info',
    description: '',
    usage: ['<message>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => { return args.length >= 1; },
});
exports.cmd = cmd;
