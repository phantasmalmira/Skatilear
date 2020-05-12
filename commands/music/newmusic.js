"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../handlers/command");
const _music_1 = require("./_music");
const discord_js_1 = require("discord.js");
const cmd = new command_1.command({
    name: 'newplay',
    run: async (client, msg, args) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        if (!client.guildPlayers.has(msg.guild.id)) {
            const volume = eval(client.settings.getSetting('player-volume', msg.guild.id));
            const shuffle = eval(client.settings.getSetting('player-shuffle', msg.guild.id));
            const repeat = client.settings.getSetting('player-repeat', msg.guild.id);
            client.guildPlayers.set(msg.guild.id, new _music_1.MusicPlayer({ volume, shuffle, repeat }));
        }
        ;
        const player = client.guildPlayers.get(msg.guild.id);
        let yturl;
        if (_music_1.MusicPlayer.isYoutube(args[0])) {
            yturl = args[0];
        }
        else { // Search and allow user to choose a video
            const search = args.join(' ');
            let botmsgcontent = '';
            const songs = await _music_1.MusicPlayer.searchYoutube(search);
            const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
            songs.forEach((song, index) => {
                if (index < 8) {
                    botmsgcontent += `**${index + 1}.** *${song.title}*\n         ⟶  ${song.author}\n\n`;
                }
            });
            const filter = (reaction, user) => {
                return (reactions.includes(reaction.emoji.name) && user.id === msg.author.id);
            };
            const embed = new discord_js_1.MessageEmbed()
                .setTitle('Search result 🔍')
                .setDescription(botmsgcontent)
                .setFooter(`${msg.author.username}  ||  ${search}`, msg.author.displayAvatarURL())
                .setTimestamp(new Date());
            const bot_msg = await msg.channel.send(embed);
            const wait_reaction = bot_msg.awaitReactions(filter, { maxEmojis: 1, time: 15000 })
                .then(collected => {
                const index = reactions.findIndex(reaction => reaction === collected.keyArray()[0]);
                bot_msg.reactions.removeAll();
                if (index === -1) {
                    const noSongEmbed = new discord_js_1.MessageEmbed()
                        .setTitle('No selected song ⛔')
                        .setDescription(`${msg.author.tag} has not selected a song in time.`);
                    bot_msg.edit(noSongEmbed);
                    throw new Error('No song chosen within time');
                }
                const selectedEmbed = new discord_js_1.MessageEmbed()
                    .setTitle('Selected song 🎵')
                    .setDescription(songs[index].title);
                bot_msg.edit(selectedEmbed);
                yturl = songs[index].link;
            })
                .catch(e => { }); // Suppress No song chosen within time
            for (const reaction of reactions) {
                if (!yturl)
                    await bot_msg.react(reaction);
                else {
                    bot_msg.reactions.removeAll();
                    break;
                }
            }
            await wait_reaction;
        }
        if (yturl) {
            _music_1.MusicPlayer.getYoutubeSong(yturl)
                .then(song => {
                player.addToQueue(msg, song);
                if (!player.nowPlaying) {
                    player.startPlay();
                }
            });
        }
    },
    security: [],
    aliases: [],
    parents: [],
    branches: [],
    category: '',
    description: '',
    usage: ['<link | search>'],
    init: (client) => {
        client.guildPlayers = new discord_js_1.Collection();
        if (!client.settings.getGlobalSetting('player-volume'))
            client.settings.setGlobalSetting('player-volume', '1.0');
        if (!client.settings.getGlobalSetting('player-shuffle'))
            client.settings.setGlobalSetting('player-shuffle', 'false');
        if (!client.settings.getGlobalSetting('player-repeat'))
            client.settings.setGlobalSetting('player-repeat', 'NO_REPEAT');
    },
    allow_args: (msg, args) => { return args.length >= 1; },
});
exports.cmd = cmd;
