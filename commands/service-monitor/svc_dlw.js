"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    name: 'download',
    run: async (client, msg, args) => { },
    security: [],
    aliases: ['dlw'],
    parents: ['service'],
    branches: [],
    category: '',
    description: '',
    usage: ['<action: check | monitor>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => { return false; },
});
exports.cmd = cmd;
