"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'alias',
    run: async (client, msg, args) => { },
    security: ['MANAGE_GUILD'],
    aliases: [],
    parents: [],
    branches: [],
    category: 'Alias',
    description: '',
    usage: ['<action : add | del | list>'],
    init: (client) => {
        const aliasdb = client.db.dbsInTraverse(['aliases']);
        client.aliases.clear();
        aliasdb.forEach((guild) => {
            if (!client.aliases.has(guild.cname))
                client.aliases.set(guild.cname, new discord_js_1.Collection());
            guild.forEach((item) => {
                client.aliases.get(guild.cname).set(item.alias, item.fcmd);
            });
        });
    },
    allow_args: (msg, args) => { return false; },
});
exports.cmd = cmd;
