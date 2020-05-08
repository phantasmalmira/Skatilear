"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const ytdl = require("ytdl-core");
class musicPlayer {
    constructor() {
        this.player = null;
        this.queue = [];
    }
}
exports.musicPlayer = musicPlayer;
const ytpattern = RegExp('^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$');
const play_yt = (conn, msg, client) => {
    let player = client.music.get(msg.guild.id);
    player.player = conn.play(ytdl(player.queue[0], { filter: "audioonly" }));
    player.queue.shift();
    player.player.on('finish', () => {
        if (player.queue[0]) {
            play_yt(conn, msg, client);
        }
        else {
            conn.disconnect();
        }
    });
};
const cmd = new command_1.command({
    _name: 'play',
    _run: async (client, msg, args) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        const arg0 = args.shift();
        //if(ytpattern.test(arg0))
        //{
        if (!client.music.has(msg.guild.id))
            client.music.set(msg.guild.id, new musicPlayer());
        client.music.get(msg.guild.id).queue.push(arg0);
        if (!msg.guild.voice || !msg.guild.voice.connection)
            msg.member.voice.channel.join()
                .then(connection => {
                play_yt(connection, msg, client);
            });
        //}
    },
    _security: [],
    _aliases: [],
    _parents: [],
    _branches: [],
    _category: 'Music',
    _description: '',
    _usage: ['<link | search>'],
    _init: (client) => {
        client.music = new discord_js_1.Collection();
    }
});
exports.cmd = cmd;
