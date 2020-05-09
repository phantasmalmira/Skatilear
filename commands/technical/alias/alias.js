"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const cmd = new command_1.command({
    _name: 'alias',
    _run: async (client, msg, args) => {
    },
    _security: [],
    _aliases: [],
    _parents: [],
    _branches: [],
    _category: '',
    _description: '',
    _usage: ['<action : add | del | list>'],
    _init: (client) => {
        const aliasdb = client.db.db('aliases', {});
        aliasdb.forEach((item) => {
            client.aliases.set(item.alias, item.fcmd);
        });
    }
});
exports.cmd = cmd;
