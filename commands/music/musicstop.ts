import {command} from '../../handlers/command';
import {MusicClient} from './_music';
import { Message, MessageEmbed } from 'discord.js';

const cmd = new command(
    {
    name: 'stop',
    run: async (client: MusicClient, msg: Message, args: string[]) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        if(client.guildPlayers.has(msg.guild.id)) {
            const player = client.guildPlayers.get(msg.guild.id);
            player.stop();
            const stopEmbed = new MessageEmbed()
            .setTitle('Stopped player')
            .setDescription('Guild player had been stopped');
            msg.channel.send(stopEmbed);
        } else {
            const noopEmbed = new MessageEmbed()
            .setTitle('Stop failure 🚫')
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