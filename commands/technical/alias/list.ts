import {command} from '../../../handlers/command';
import {myClient} from '../../../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    name: 'list',
    run: async (client: myClient, msg: Message, args: string[]) => {
        let msgcontent = '';
        let index = 1;
        client.aliases.forEach((val, key) => {
            msgcontent += `${index}. ${client.commandprefix}${key} ⇶ ${client.commandprefix}${val}\n`;
            ++index;
        });
        msg.channel.send(`List of aliases:\n\`\`\`markdown\n${msgcontent}\`\`\``);
    },
    security: [],
    aliases : [], 
    parents : ['alias'], 
    branches : [],
    category : 'Alias', 
    description : '', 
    usage : [],
    init : (client: myClient) => {}
    }
)
export {cmd};