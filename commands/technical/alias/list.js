"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const cmd = new command_1.command({
    name: 'list',
    run: async (client, msg, args) => {
        let msgcontent = '';
        let index = 1;
        client.aliases.forEach((val, key) => {
            msgcontent += `${index}. ${client.commandprefix}${key} ⇶ ${client.commandprefix}${val}\n`;
            ++index;
        });
        msg.channel.send(`List of aliases:\n\`\`\`markdown\n${msgcontent}\`\`\``);
    },
    security: [],
    aliases: [],
    parents: ['alias'],
    branches: [],
    category: 'Alias',
    description: '',
    usage: [],
});
exports.cmd = cmd;
