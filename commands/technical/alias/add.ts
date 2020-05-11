import {command} from '../../../handlers/command';
import { Message, Collection } from 'discord.js';
import {myClient} from '../../../index';

const cmd = new command(
    {
    name: 'add',
    run: async (client: myClient, msg: Message, args: string[]) => {
        const alias = args.shift();
        const cmd = args.shift();
        const res_cmd = client.cmd_handler.resolve_command(cmd, args);
        if(res_cmd) {
            const cmdobj:command = res_cmd.command;
            if(!client.aliases.has(msg.guild.id)) client.aliases.set(msg.guild.id, new Collection());
            let cmdcall = ''
            if (cmdobj.parents.length > 0)
                cmdcall = `${cmdobj.parents.join(' ')} ${cmdobj.name}`;
            else
                cmdcall = `${cmdobj.name}`;
            if(args.length > 0)
                cmdcall += ` ${args.join(' ')}`;
            client.aliases.get(msg.guild.id).set(alias, cmdcall);
            client.db.db(msg.guild.id, {traversepath: ['aliases']}).insert({alias: alias, fcmd: cmdcall});
            msg.channel.send(`Set \`${alias}\` to call ${cmdcall}`);
        }
        else {
            msg.reply(`\`${cmd}\` is not a valid command.`);
        }
    },
    security: ['MANAGE_GUILD'],
    aliases : [], 
    parents : ['alias'], 
    branches : [],
    category : 'Alias', 
    description : '', 
    usage : ['<alias>', '<command>', '<args?...>'],
    //init : (client: myClient) => {},
    allow_args: (msg: Message, args: string[]) => {return args.length >= 2;},
    }
)
export {cmd};