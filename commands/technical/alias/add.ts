import {command} from '../../../handlers/command';
import { Message } from 'discord.js';
import {myClient} from '../../../index';

const cmd = new command(
    {
    _name: 'add',
    _run: async (client: myClient, msg: Message, args: string[]) => {
        const alias = args.shift();
        const cmd = args.shift();
        const res_cmd = client.cmd_handler.resolve_command(cmd, args);
        if(res_cmd) {
            const cmdobj:command = res_cmd.command;
            let cmdcall = ''
            if (cmdobj.parents.length > 0)
                cmdcall = `${cmdobj.parents.join(' ')} ${cmdobj.name}`;
            else
                cmdcall = `${cmdobj.name}`;
            if(args.length > 0)
                cmdcall += ` ${args.join(' ')}`;
            client.aliases.set(alias, cmdcall);
            client.db.db('aliases', {}).insert({alias: alias, fcmd: cmdcall});
            msg.channel.send(`Set \`${alias}\` to call ${cmdcall}`);
        }
        else {
            msg.reply(`\`${cmd}\` is not a valid command.`);
        }
    },
    _security: [],
    _aliases : [], 
    _parents : ['alias'], 
    _branches : [],
    _category : 'Alias', 
    _description : '', 
    _usage : ['<alias>', '<command>', '<args?...>'],
    _init : (client: myClient) => {}
    }
)
export {cmd};