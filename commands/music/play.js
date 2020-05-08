"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const ytpattern = RegExp('^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$');
const cmd = new command_1.command({
    _name: 'play',
    _run: async (client, msg, args) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        const arg0 = args.shift();
        if (ytpattern.test(arg0)) // is a youtube link
         {
        }
    },
    _security: [],
    _aliases: [],
    _parents: [],
    _branches: [],
    _category: '',
    _description: '',
    _usage: ['<link | search>'],
    _init: (client) => { }
});
exports.cmd = cmd;
