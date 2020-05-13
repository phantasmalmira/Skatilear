"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const _service_1 = require("./_service");
const cmd = new command_1.command({
    name: 'check',
    run: async (client, msg, args) => {
        const name = args.shift();
        const host = args.shift();
        const port = parseInt(args.shift());
        let timeout;
        if (args.length > 0) {
            timeout = parseInt(args.shift());
        }
        _service_1.ServiceMonitor.CheckService([host, port], { timeout: timeout })
            .then(res => {
            msg.channel.send(`${name}\n(${host}:${port}) is ${(res.online ? 'Online' : 'Offline')}.`);
        })
            .catch(e => {
            msg.channel.send(`Error occured during check:\`\`\`${e}\`\`\``);
        });
    },
    security: [],
    aliases: [],
    parents: ['service'],
    branches: [],
    category: 'Network',
    description: '',
    usage: ['<service name>', '<host>', '<port>', '<timeout?[ms]>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => {
        if (args.length < 3)
            return false;
        const port = parseInt(args[2]);
        if (isNaN(port))
            return false;
        if (port < 0 || port > 65535) {
            msg.channel.send('Port number must be from 0 - 65535');
            return false;
        }
        if (args.length > 3) {
            const timeout = parseInt(args[3]);
            if (isNaN(timeout))
                return false;
            if (timeout < 1500 || timeout > 15000) {
                msg.channel.send(`Timeout must be 1500 - 15000ms`);
                return false;
            }
        }
        return true;
    },
});
exports.cmd = cmd;
