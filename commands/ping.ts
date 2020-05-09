import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    _name: 'ping',
    _run: async (client: myClient, msg: Message, args: string[]) => {
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
    _security: [],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : 'Technical', 
    _description : '', 
    _usage : [],
    _init : (client: myClient) => {}
    }
)
export {cmd};