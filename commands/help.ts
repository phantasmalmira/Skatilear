import {command} from '../handlers/command';
import {myClient} from '../index';
import { Message } from 'discord.js';

const child_man = (prefix: string, cmdobj: command):string[] => {
    let helpstr:string[] = [];

    let content = ''
    if(cmdobj.parents.length > 0)
        content = `+ ${prefix}${cmdobj.parents.join(' ')} ${cmdobj.name} ${cmdobj.usage.join(' ')}`.trim();
    else
        content = `+ ${prefix}${cmdobj.name} ${cmdobj.usage.join(' ')}`.trim();
    helpstr.push(content + '\n');
    if(cmdobj.branches.length > 0) {
        for(const branchend of cmdobj.branches) {
            const branchend_h = child_man(prefix, branchend);
            for( const _end of branchend_h) {
                helpstr.push(`- ${_end}`);
            }
        }
    }
    return helpstr;
};

const cmd = new command(
    {
    _name: 'help',
    _run: async (client: myClient, msg: Message, args: string[]) => {
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
            help_ += `# ${cat}\n`;
            curcat.forEach( item => {
                for(const e of child_man(client.commandprefix, item)) {
                    help_ += `- ${e}`;
                }
            });
            help_ += '\n';
        }
        msg.channel.send(`\`\`\`markdown\n${help_}\`\`\``);
    },
    _security: [],
    _aliases : [], 
    _parents : [], 
    _branches : [],
    _category : 'Info', 
    _description : '', 
    _usage : [],
    _init : (client: myClient) => {}
    }
)
export {cmd};