"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../handlers/command");
const cmd = new command_1.command({
    _name: 'schedule',
    _run: async (client, msg, args) => { },
    _security: [],
    _aliases: ['sched'],
    _parents: [],
    _branches: [],
    _category: '',
    _description: '',
    _usage: [],
    _init: (client) => { }
});
exports.cmd = cmd;
