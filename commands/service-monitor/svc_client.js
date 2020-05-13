"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
class MonitorTask {
    constructor(name, host, port, task) {
        this.name = name;
        this.host = host;
        this.port = port;
        this.task = task;
    }
}
exports.MonitorTask = MonitorTask;
const cmd = new command_1.command({
    name: 'service',
    run: async (client, msg, args) => { },
    security: [],
    aliases: ['svc'],
    parents: [],
    branches: [],
    category: 'Network',
    description: '',
    usage: ['<action: check | monitor>'],
    init: (client) => {
        client.guildMonitors = new discord_js_1.Collection();
    },
    allow_args: (msg, args) => { return false; },
});
exports.cmd = cmd;
