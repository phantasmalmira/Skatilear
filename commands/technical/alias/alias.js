"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const cmd = new command_1.command({
    name: 'alias',
    run: async (client, msg, args) => { },
    security: [],
    aliases: [],
    parents: [],
    branches: [],
    category: 'Alias',
    description: '',
    usage: ['<action : add | del | list>'],
    init: (client) => {
        const aliasdb = client.db.db('aliases', {});
        aliasdb.forEach((item) => {
            client.aliases.set(item.alias, item.fcmd);
        });
    }
});
exports.cmd = cmd;
