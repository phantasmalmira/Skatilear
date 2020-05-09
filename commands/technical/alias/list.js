"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const cmd = new command_1.command({
    _name: 'list',
    _run: async (client, msg, args) => {
        let msgcontent = '';
        let index = 1;
        client.aliases.forEach((val, key) => {
            msgcontent += `${index}. ${client.commandprefix}${key} ⇶ ${client.commandprefix}${val}\n`;
            ++index;
        });
        msg.channel.send(`List of aliases:\n\`\`\`markdown\n${msgcontent}\`\`\``);
    },
    _security: [],
    _aliases: [],
    _parents: ['alias'],
    _branches: [],
    _category: '',
    _description: '',
    _usage: [],
    _init: (client) => { }
});
exports.cmd = cmd;
