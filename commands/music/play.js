"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const discord_js_1 = require("discord.js");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
class song {
    constructor(title, uri) {
        this.title = title;
        this.uri = uri;
    }
}
class musicPlayer {
    constructor() {
        this.player = null;
        this.queue = [];
    }
}
exports.musicPlayer = musicPlayer;
const ytpattern = RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);
const play_yt = (conn, msg, client) => {
    let player = client.music.get(msg.guild.id);
    player.player = conn.play(ytdl(player.queue[0].uri, { filter: "audioonly", highWaterMark: 1 << 25 }));
    if (!client.cursong.has(msg.guild.id))
        client.cursong.set(msg.guild.id, player.queue.shift());
    player.player.on('finish', () => {
        client.cursong.delete(msg.guild.id);
        if (player.queue[0]) {
            play_yt(conn, msg, client);
        }
        else {
            conn.disconnect();
        }
    });
    player.player.on('error', console.error);
};
const cmd = new command_1.command({
    _name: 'play',
    _run: async (client, msg, args) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        const arg0 = args.shift();
        if (ytdl.validateURL(arg0)) {
            ytdl.getBasicInfo(arg0).then(info => {
                msg.channel.send({ embed: {
                        title: 'Selected song 🎵',
                        description: info.title
                    } });
                if (!client.music.has(msg.guild.id))
                    client.music.set(msg.guild.id, new musicPlayer());
                client.music.get(msg.guild.id).queue.push(new song(info.title, info.video_url));
            }).then(() => {
                if (!msg.guild.voice || !msg.guild.voice.connection)
                    msg.member.voice.channel.join()
                        .then(connection => {
                        play_yt(connection, msg, client);
                    });
            });
        }
        else {
            let searchResult = [];
            await ytsr(`${arg0} ${args.join(' ')}`, { limit: 10 })
                .then((res) => {
                res.items.forEach(i => {
                    if (i.title && i.link && i.author)
                        searchResult.push({ title: i.title, uri: i.link, author: i.author });
                });
            });
            let msgcontent = '';
            const emojifilters = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
            searchResult.forEach((e, i) => {
                if (i < 5)
                    msgcontent += `${emojifilters[i]} ➤ [${e.title}](${e.uri})\n > By: [${e.author.name}](${e.author.ref})\n\n`;
            });
            const reactionfilter = (reaction, user) => {
                if (emojifilters.find(e => e === reaction.emoji.name) && user.id === msg.author.id)
                    return true;
                return false;
            };
            const bot_msg = await msg.channel.send({ embed: {
                    title: 'Search result 🔍',
                    description: msgcontent,
                    footer: { text: `${msg.author.tag} 🔍 ${arg0} ${args.join(' ')}`, icon_url: msg.author.displayAvatarURL() },
                    timestamp: new Date()
                }
            });
            bot_msg.awaitReactions(reactionfilter, { maxEmojis: 1, time: 15000 })
                .then(collected => {
                let sel = emojifilters.findIndex(e => e === collected.keyArray()[0]);
                bot_msg.delete();
                if (sel === -1) {
                    msg.channel.send({ embed: {
                            title: 'No selected song ⛔',
                            description: `${msg.author.tag} has not selected a song in time.`
                        } });
                    throw new Error('No song chosen within time');
                }
                msg.channel.send({ embed: {
                        title: 'Selected song 🎵',
                        description: searchResult[sel].title
                    } });
                return sel;
            }).then((sel) => {
                setTimeout(() => {
                    if (!client.music.has(msg.guild.id))
                        client.music.set(msg.guild.id, new musicPlayer());
                    client.music.get(msg.guild.id).queue.push(new song(searchResult[sel].title, searchResult[sel].uri));
                    if (!msg.guild.voice || !msg.guild.voice.connection)
                        msg.member.voice.channel.join()
                            .then(connection => {
                            play_yt(connection, msg, client);
                        });
                }, 500);
            }).catch(console.error);
            try {
                await bot_msg.react(emojifilters[0]);
                await bot_msg.react(emojifilters[1]);
                await bot_msg.react(emojifilters[2]);
                await bot_msg.react(emojifilters[3]);
                await bot_msg.react(emojifilters[4]);
            }
            catch (e) {
                //console.error(e);
                // Error raised when the msg reaction is fulfilled before all react are done.
            }
        }
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
        client.cursong = new discord_js_1.Collection();
    }
});
exports.cmd = cmd;
