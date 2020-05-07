"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../handlers/command");
const cmd = new command_1.command({
    _name: 'list',
    _run: async (client, msg, args) => {
        if (client.scheduleds.size == 0)
            msg.channel.send(`There are no scheduled tasks.`);
        else {
            let avail_keys = '';
            let keyindex = 1;
            client.scheduleds.forEach((val, key) => {
                avail_keys += `${keyindex}: ${key}\n`;
                ++keyindex;
            });
            avail_keys = avail_keys.substring(0, avail_keys.length - 1);
            msg.channel.send(`Scheduled tasks: \`\`\`${avail_keys}\`\`\``);
        }
    },
    _security: [],
    _aliases: [],
    _parents: ['schedule'],
    _branches: [],
    _category: '',
    _description: '',
    _usage: [],
    _init: (client) => { }
});
exports.cmd = cmd;
