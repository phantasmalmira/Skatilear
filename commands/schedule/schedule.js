"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'schedule',
    run: async (client, msg, args) => { },
    security: [],
    aliases: ['sched'],
    parents: [],
    branches: [],
    category: 'Technical',
    description: '',
    usage: ['<action: add | del | list>'],
    init: (client) => {
        client.scheduleds = new discord_js_1.Collection();
    }
});
exports.cmd = cmd;
