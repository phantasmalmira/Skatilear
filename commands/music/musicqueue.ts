import {command} from '../../handlers/command';
import {MusicClient} from './_music';
import { Message, MessageEmbed } from 'discord.js';

const cmd = new command(
    {
    name: 'queue',
    run: async (client: MusicClient, msg: Message, args: string[]) => {
        let playing = false;
        if(client.guildPlayers.has(msg.guild.id)) { 
            const player = client.guildPlayers.get(msg.guild.id);

            if(player.nowPlaying) {
                playing = true;
                let description = `**Current Track** 🎧\n${player.nowPlaying.title}\n\n**Up Next** 🎶\n`;
                player.queue.forEach( (song, index) => {
                    description += `${index}. ${song.title}\n`;
                });

                const queueEmbed = new MessageEmbed()
                .setTitle('Track Queue 🎹')
                .setDescription(description);

                msg.channel.send(queueEmbed);
            }
        }
        if(!playing) {
            const noopEmbed = new MessageEmbed()
            .setTitle('Track Queue 🎹')
            .setDescription('Nothing is playing currently');
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