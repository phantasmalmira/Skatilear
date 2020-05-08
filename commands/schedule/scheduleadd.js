"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const cmd = new command_1.command({
    _name: 'add',
    _run: async (client, msg, args) => {
        const interval = parseInt(args.shift());
        const cmd = args.shift();
        const res_cmd = client.cmd_handler.resolve_command(cmd, args);
        if (res_cmd) // command is found
         {
            const cmdargs = res_cmd.args;
            const cmdobj = res_cmd.command;
            if (client.cmd_handler.valid_args(cmdobj, cmdargs)) {
                const s_args = res_cmd.args.length > 0 ? ` ${args.join(' ')}` : '';
                let schedid;
                const validchars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                do {
                    let randid = '';
                    for (var i = 0; i < 5; ++i) {
                        randid += validchars.charAt(Math.floor(Math.random() * validchars.length));
                    }
                    schedid = randid;
                } while (client.scheduleds.has(schedid));
                msg.reply(`Added the following command to run every ${interval}s\`\`\`${cmd}${s_args}\`\`\`SCHEDID: ${schedid}`);
                client.scheduleds.set(schedid, setInterval(() => { cmdobj.run(client, msg, cmdargs); }, interval * 1000));
            }
        }
        else {
            msg.reply(`\`${cmd}\` is not a valid command.`);
        }
    },
    _security: [],
    _aliases: [],
    _parents: ['schedule'],
    _branches: [],
    _category: '',
    _description: '',
    _usage: ['<interval[seconds]:_int>', '<command>', '<args?...>'],
    _init: (client) => { }
});
exports.cmd = cmd;
