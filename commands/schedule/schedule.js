"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    _name: 'schedule',
    _run: async (client, msg, args) => { },
    _security: [],
    _aliases: ['sched'],
    _parents: [],
    _branches: [],
    _category: '',
    _description: '',
    _usage: ['<action: add | del | list>'],
    _init: (client) => {
        client.scheduleds = new discord_js_1.Collection();
    }
});
exports.cmd = cmd;
