"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'add',
    run: async (client, msg, args) => {
        const alias = args.shift();
        const cmd = args.shift();
        const res_cmd = client.cmd_handler.resolve_command(cmd, args);
        if (res_cmd) {
            const cmdobj = res_cmd.command;
            if (!client.aliases.has(msg.guild.id))
                client.aliases.set(msg.guild.id, new discord_js_1.Collection());
            let cmdcall = '';
            if (cmdobj.parents.length > 0)
                cmdcall = `${cmdobj.parents.join(' ')} ${cmdobj.name}`;
            else
                cmdcall = `${cmdobj.name}`;
            if (args.length > 0)
                cmdcall += ` ${args.join(' ')}`;
            client.aliases.get(msg.guild.id).set(alias, cmdcall);
            client.db.db(msg.guild.id, { traversepath: ['aliases'] }).insert({ alias: alias, fcmd: cmdcall });
            msg.channel.send(`Set \`${alias}\` to call ${cmdcall}`);
        }
        else {
            msg.reply(`\`${cmd}\` is not a valid command.`);
        }
    },
    security: [],
    aliases: [],
    parents: ['alias'],
    branches: [],
    category: 'Alias',
    description: '',
    usage: ['<alias>', '<command>', '<args?...>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => { return args.length >= 2; },
});
exports.cmd = cmd;
