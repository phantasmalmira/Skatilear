"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const cmd = new command_1.command({
    name: 'list',
    run: async (client, msg, args) => {
        let msgcontent = '';
        let index = 1;
        if (client.aliases.has(msg.guild.id)) {
            client.aliases.get(msg.guild.id).forEach((val, key) => {
                msgcontent += `${index}. ${client.commandprefix}${key} ⇶ ${client.commandprefix}${val}\n`;
                ++index;
            });
        }
        if (msgcontent === '')
            msgcontent += 'No aliases found';
        msg.channel.send(`List of aliases:\n\`\`\`markdown\n${msgcontent}\`\`\``);
    },
    security: ['MANAGE_GUILD'],
    aliases: [],
    parents: ['alias'],
    branches: [],
    category: 'Alias',
    description: '',
    usage: [],
});
exports.cmd = cmd;
