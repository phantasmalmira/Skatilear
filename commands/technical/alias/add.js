"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../../handlers/command");
const cmd = new command_1.command({
    _name: 'add',
    _run: async (client, msg, args) => {
        const alias = args.shift();
        const cmd = args.shift();
        const res_cmd = client.cmd_handler.resolve_command(cmd, args);
        if (res_cmd) {
            const cmdobj = res_cmd.command;
            let cmdcall = '';
            if (cmdobj.parents.length > 0)
                cmdcall = `${cmdobj.parents.join(' ')} ${cmdobj.name}`;
            else
                cmdcall = `${cmdobj.name}`;
            if (args.length > 0)
                cmdcall += ` ${args.join(' ')}`;
            client.aliases.set(alias, cmdcall);
            client.db.db('aliases', {}).insert({ alias: alias, fcmd: cmdcall });
            msg.channel.send(`Set \`${alias}\` to call ${cmdcall}`);
        }
        else {
            msg.reply(`\`${cmd}\` is not a valid command.`);
        }
    },
    _security: [],
    _aliases: [],
    _parents: ['alias'],
    _branches: [],
    _category: '',
    _description: '',
    _usage: ['<alias>', '<command>', '<args?...>'],
    _init: (client) => { }
});
exports.cmd = cmd;
