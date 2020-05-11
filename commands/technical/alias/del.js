"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const cmd = new command_1.command({
    name: 'del',
    run: async (client, msg, args) => {
        const alias = args.shift();
        if (client.aliases.has(msg.guild.id) && client.aliases.get(msg.guild.id).has(alias)) {
            const aliasfcmd = client.aliases.get(msg.guild.id).get(alias);
            const aliasdb = client.db.db(msg.guild.id, { traversepath: ['aliases'] });
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
    security: ['MANAGE_GUILD'],
    aliases: [],
    parents: ['alias'],
    branches: [],
    category: 'Alias',
    description: '',
    usage: ['<alias>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => { return args.length >= 1; },
});
exports.cmd = cmd;
