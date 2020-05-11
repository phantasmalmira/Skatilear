"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../handlers/command");
const cmd = new command_1.command({
    name: 'ping',
    run: async (client, msg, args) => {
        let pingmsg = await msg.channel.send('🏓 Pinging');
        const serverping = pingmsg.createdAt.getTime() - msg.createdAt.getTime();
        `Server ping: ${serverping}`;
        pingmsg.edit('', { embed: {
                title: "🏓 Ping results",
                description: [
                    `\n**Server**: \n${serverping}ms\n`,
                    `**API**: \n${client.ws.ping}ms\n\n`,
                ].join('\n'),
                footer: { text: `Requested by ${msg.author.tag}`, icon_url: msg.author.displayAvatarURL() },
                timestamp: new Date()
            } });
    },
    security: [],
    aliases: [],
    parents: [],
    branches: [],
    category: 'Technical',
    description: '',
    usage: [],
    init: (client) => { }
});
exports.cmd = cmd;
