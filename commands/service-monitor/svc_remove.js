"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    name: 'remove',
    run: async (client, msg, args) => {
        const svcname = args.shift();
        if (!client.guildMonitors.has(msg.guild.id) || !client.guildMonitors.get(msg.guild.id).has(svcname)) {
            msg.channel.send(`Invalid service, please check ${client.commandprefix}service list.`);
            return;
        }
        const mtask = client.guildMonitors.get(msg.guild.id).get(svcname);
        clearInterval(mtask.task);
        client.guildMonitors.get(msg.guild.id).delete(mtask.name);
        msg.channel.send(`Successfully deleted ${mtask.name} from services monitored.`);
    },
    security: [],
    aliases: [],
    parents: ['service'],
    branches: [],
    category: 'Network',
    description: '',
    usage: ['<service name>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => {
        return args.length >= 1;
    },
});
exports.cmd = cmd;
