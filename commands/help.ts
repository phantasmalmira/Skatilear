import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const child_man = (prefix: string, cmdobj: command):string[] => {
    let helpstr:string[] = [];

    let content = ''
    if(cmdobj.parents.length > 0)
        content = `◈ ${prefix}${cmdobj.parents.join(' ')} ${cmdobj.name} ${cmdobj.usage.join(' ')}`.trim();
    else
        content = `◈ ${prefix}${cmdobj.name} ${cmdobj.usage.join(' ')}`.trim();
    helpstr.push(content + '\n');
    if(cmdobj.branches.length > 0) {
        for(const branchend of cmdobj.branches) {
            const branchend_h = child_man(prefix, branchend);
            for( const _end of branchend_h) {
                helpstr.push(`─${_end}`);
            }
        }
    }
    return helpstr;
};

const cmd = new command(
    {
    name: 'help',
    run: async (client: myClient, msg: Message, args: string[]) => {
        let help_ = '';
        let cmdcategories:string[] = [];
        client.commands.forEach( val => {
            if(cmdcategories.find(category => val.category === category))
                return;
            else {
                cmdcategories.push(val.category);
            }
        } );
        for (const cat of cmdcategories) {
            const curcat = client.commands.filter(val => val.category === cat);
            help_ += `**${cat}**\n`;
            curcat.forEach( item => {
                for(const e of child_man(client.commandprefix, item)) {
                    help_ += `├${e}`;
                }
            });
            help_ += '\n';
            help_ = help_.substring(0, help_.lastIndexOf('├')) + '└' + help_.substring(help_.lastIndexOf('├') + 1);
        }
        msg.channel.send({embed: {
            title: "❔📖 Help page ",
            description: help_
        }});
    },
    security: [],
    aliases : [], 
    parents : [], 
    branches : [],
    category : 'Info', 
    description : '', 
    usage : [],
    //init : (client: myClient) => {},
    //allow_args: (args: string[]) => {return true;},
    }
)
export {cmd};