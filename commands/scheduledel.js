"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../handlers/command");
const cmd = new command_1.command({
    _name: 'del',
    _run: async (client, msg, args) => {
        const schedid = args.shift();
        if (!client.scheduleds.has(schedid)) {
            msg.reply(`${schedid} is not a valid schedule! \`${client.commandprefix}schedule list\` to check list of valid schedid's`);
        }
        else {
            clearInterval(client.scheduleds.get(schedid));
            client.scheduleds.delete(schedid);
            msg.reply(`${schedid} had been removed from scheduled tasks successfully.`);
        }
    },
    _security: [],
    _aliases: [],
    _parents: ['schedule'],
    _branches: [],
    _category: '',
    _description: '',
    _usage: ['<schedid>'],
    _init: (client) => { }
});
exports.cmd = cmd;
