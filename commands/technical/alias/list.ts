import {command} from '../../../handlers/command';
import {myClient} from '../../../index';
import { Message } from 'discord.js';

const cmd = new command(
    {
    name: 'list',
    run: async (client: myClient, msg: Message, args: string[]) => {
        let msgcontent = '';
        let index = 1;
        if(client.aliases.has(msg.guild.id)) {
            client.aliases.get(msg.guild.id).forEach((val, key) => {
                msgcontent += `${index}. ${client.commandprefix}${key} ⇶ ${client.commandprefix}${val}\n`;
                ++index;
            });
        }
        if(msgcontent === '') msgcontent += 'No aliases found';
        msg.channel.send(`List of aliases:\n\`\`\`markdown\n${msgcontent}\`\`\``);
    },
    security: ['MANAGE_GUILD'],
    aliases : [], 
    parents : ['alias'], 
    branches : [],
    category : 'Alias', 
    description : '', 
    usage : [],
    //init : (client: myClient) => {},
    //allow_args: (args: string[]) => {return true;},
    }
)
export {cmd};