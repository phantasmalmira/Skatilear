import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    name: 'ping',
    run: async (client: myClient, msg: Message, args: string[]) => {
        let pingmsg = await msg.channel.send('🏓 Pinging');
        const serverping = pingmsg.createdAt.getTime() - msg.createdAt.getTime();
        `Server ping: ${serverping}`
        pingmsg.edit('', {embed: {
            title: "🏓 Ping results",
            description: [
                `\n**Server**: \n${serverping}ms\n`,
                `**API**: \n${client.ws.ping}ms\n\n`,
            ].join('\n'),
            footer: {text: `Requested by ${msg.author.tag}`, icon_url: msg.author.displayAvatarURL()},
            timestamp: new Date()
        }});
        
    },
    security: [],
    aliases : [], 
    parents : [], 
    branches : [],
    category : 'Technical', 
    description : '', 
    usage : [],
    //init : (client: myClient) => {},
    //allow_args: (args: string[]) => {return true;},
    }
)
export {cmd};