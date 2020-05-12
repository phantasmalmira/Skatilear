import {command} from '../../handlers/command';
import {MusicClient} from './_music';
import { Message, MessageEmbed } from 'discord.js';

const cmd = new command(
    {
    name: 'disconnect',
    run: async (client: MusicClient, msg: Message, args: string[]) => {
        if (!msg.member.voice.channel) {
            msg.reply(`Please join a voice channel first.`);
            return;
        }
        let disconnected = false;
        if(client.guildPlayers.has(msg.guild.id)) {
            const player = client.guildPlayers.get(msg.guild.id);
            if(player.v_connection.status !== 4) {
                player.disconnect();
                disconnected = true;
                const actEmbed = new MessageEmbed()
                .setTitle('Disconnected 🔈')
                .setDescription('Guild player is disconnected');
                msg.channel.send(actEmbed);
            }
        }
        if(!disconnected) {
            const noopEmbed = new MessageEmbed()
            .setTitle('Disconnect failure 🚫')
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