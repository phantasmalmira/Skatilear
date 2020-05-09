"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const cmd = new command_1.command({
    _name: 'del',
    _run: async (client, msg, args) => {
        const alias = args.shift();
        if (client.aliases.has(alias)) {
            const aliasfcmd = client.aliases.get(alias);
            const aliasdb = client.db.db('aliases', {});
            if (aliasdb.delete({ alias: alias, fcmd: aliasfcmd })) {
                msg.reply(`Successfully deleted ${alias}.`);
                client.aliases.delete(alias);
            }
            else {
                msg.reply(`Error occured during delete of ${alias}.`);
            }
        }
        else {
            msg.reply(`\`${alias}\` is not an alias, check ${client.commandprefix}alias list.`);
        }
    },
    _security: [],
    _aliases: [],
    _parents: ['alias'],
    _branches: [],
    _category: 'Alias',
    _description: '',
    _usage: ['<alias>'],
    _init: (client) => { }
});
exports.cmd = cmd;
