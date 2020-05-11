"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    _name: 'reload',
    _run: async (client, msg, args) => {
        console.log(`Reloading...`);
        const nCmds = client.init_commands();
        msg.channel.send(`Reloaded ${nCmds} commands.`);
        console.log(`Reloaded ${nCmds} commands.`);
    },
    _security: ['BOT_OWNER'],
    _aliases: [],
    _parents: [],
    _branches: [],
    _category: 'Technical',
    _description: '',
    _usage: [],
    _init: (client) => { }
});
exports.cmd = cmd;
