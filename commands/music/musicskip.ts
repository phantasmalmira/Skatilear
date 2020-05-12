import {command} from '../../handlers/command';
import {MusicClient} from './_music';
import { Message, MessageEmbed } from 'discord.js';

const cmd = new command(
    {
    name: 'skip',
    run: async (client: MusicClient, msg: Message, args: string[]) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        let skipped = false;
        if(client.guildPlayers.has(msg.guild.id)) {
            const player = client.guildPlayers.get(msg.guild.id);
            if(player.nowPlaying) {
                player.dispatcher.end();
                skipped = true;
                await new Promise(resolve => setTimeout(resolve, 500));
                let nowplaying;
                if(player.nowPlaying)
                    nowplaying = player.nowPlaying.title;
                else
                    nowplaying = 'Nothing';
                const skippedEmbed = new MessageEmbed()
                .setTitle('Skipped Song 🎵 Now playing ')
                .setDescription(`${nowplaying}`);
                msg.channel.send(skippedEmbed);
            }
        }
        if(!skipped) {
            const noopEmbed = new MessageEmbed()
            .setTitle('Skip failure 🚫')
            .setDescription('There is no active player currently');
            msg.channel.send(noopEmbed);
        }
    },
    security: [],
    aliases : [], 
    parents : [], 
    branches : [],
    category : 'Music', 
    description : '', 
    usage : [],
    //init : (client: myClient) => {},
    //allow_args: (msg: Message, args: string[]) => {return true;},
    }
)
export {cmd};