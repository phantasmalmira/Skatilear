"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    name: 'reload',
    run: async (client, msg, args) => {
        console.log(`Reloading...`);
        const nCmds = client.init_commands();
        msg.channel.send(`Reloaded ${nCmds} commands.`);
        console.log(`Reloaded ${nCmds} commands.`);
    },
    security: ['BOT_OWNER'],
    aliases: [],
    parents: [],
    branches: [],
    category: 'Technical',
    description: '',
    usage: [],
});
exports.cmd = cmd;
