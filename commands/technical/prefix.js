"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    name: 'prefix',
    run: async (client, msg, args) => {
        const newprefix = args.shift();
        msg.channel.send(`Changed prefix from ${client.commandprefix} to ${newprefix}.`);
        client.settings.setGlobalSetting('cmdprefix', newprefix);
        client.commandprefix = newprefix;
    },
    security: [],
    aliases: [],
    parents: [],
    branches: [],
    category: 'Technical',
    description: '',
    usage: ['<newprefix>'],
    init: (client) => {
        const prefix = client.settings.getGlobalSetting('cmdprefix');
        if (prefix) {
            console.log(`Changed prefix from ${client.commandprefix} to ${prefix}`);
            client.commandprefix = prefix;
        }
    },
    allow_args: (msg, args) => { return args.length >= 1; },
});
exports.cmd = cmd;
