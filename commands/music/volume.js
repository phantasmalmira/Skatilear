"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'volume',
    run: async (client, msg, args) => {
        const newvol = parseFloat(args.shift());
        const oldvol = parseFloat(client.settings.getSetting('player-volume', msg.guild.id));
        client.settings.setGuildSetting(msg.guild.id, 'player-volume', newvol.toString());
        if (client.guildPlayers.has(msg.guild.id)) {
            const player = client.guildPlayers.get(msg.guild.id);
            player.volume = newvol;
            if (player.nowPlaying)
                player.dispatcher.setVolume(newvol);
        }
        ;
        const msgembed = new discord_js_1.MessageEmbed()
            .setTitle('Changed guild player volume 🎧')
            .setDescription(`Volume is changed from ${parseInt((oldvol * 100).toString())}% to ${parseInt((newvol * 100).toString())}%`);
        msg.channel.send(msgembed);
    },
    security: [],
    aliases: [],
    parents: [],
    branches: [],
    category: '',
    description: '',
    usage: ['<volume: (0 - 1.0]>'],
    //init : (client: myClient) => {},
    allow_args: (msg, args) => {
        if (args.length > 0) {
            const vol = parseFloat(args[0]);
            if (isNaN(vol))
                return false;
            return vol > 0 && vol <= 1;
        }
        return false;
    },
});
exports.cmd = cmd;
