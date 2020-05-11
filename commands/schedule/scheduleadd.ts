import {command} from '../../handlers/command';
//import {myClient} from '../../index';
import {schedClient} from './schedule';
import { Message, Collection } from 'discord.js';

const cmd = new command(
    {
    name: 'add',
    run: async (client: schedClient, msg: Message, args: string[]) => {
        const interval = parseInt(args.shift());
        const cmd = args.shift();
        const res_cmd = client.cmd_handler.resolve_command(cmd, args);
        if(res_cmd) // command is found
        {
            const cmdargs = res_cmd.args;
            const cmdobj = res_cmd.command;
            if(client.cmd_handler.valid_args(cmdobj, cmdargs))
            {
                if(!client.scheduleds.has(msg.guild.id)) client.scheduleds.set(msg.guild.id, new Collection());
                if(client.scheduleds.get(msg.guild.id).size >= 5) {
                    msg.channel.send('Only a maximum of 5 tasks is allowed per guild.');
                    return;
                }
                const s_args = res_cmd.args.length > 0 ? ` ${args.join(' ')}`: '';
                let schedid:string;
                const validchars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                do {
                    let randid = '';
                    for(var i = 0; i < 5; ++i)
                    {
                        randid += validchars.charAt(Math.floor(Math.random() * validchars.length));
                    }
                    schedid = randid;
                } while (client.scheduleds.get(msg.guild.id).has(schedid));
                msg.reply(`Added the following command to run every ${interval}s\`\`\`${cmd}${s_args}\`\`\`SCHEDID: ${schedid}`);

                
                client.scheduleds.get(msg.guild.id).set(schedid, setInterval( 
                    () => {cmdobj.run(client, msg, cmdargs)},
                    interval * 1000
                ));
            }
            else {
                msg.reply(`The argument for the given command is not valid.`);
            }
        }
        else {
            msg.reply(`\`${cmd}\` is not a valid command.`);
        }
    },
    security: ['ADMINISTRATOR'],
    aliases : [], 
    parents : ['schedule'], 
    branches : [],
    category : 'Technical', 
    description : '', 
    usage : ['<interval[seconds]:_int>', '<command>', '<args?...>'],
    //init : (client: schedClient) => {},
    //allow_args: (args: string[]) => {return true;},
    }
)
export {cmd};