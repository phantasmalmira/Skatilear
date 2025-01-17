import { Message, PermissionString } from "discord.js";
import { myClient } from "../index";
import * as chalk from 'chalk';
import * as fs from 'fs';

interface command {
    name: string;
    aliases: string[];
    parents: string[];
    _parents: string[];
    branches: command[];
    category: string;
    description: string;
    usage: string[];
    security: security[];
    run(client: myClient, msg: Message, args: string[]): void;
    init(client: myClient): void;
    allow_args(msg: Message, args: string[]): boolean;
    pretty_usage(): string;
    getCallCommand(): string;
}

type security = 
| PermissionString 
| 'DISABLED'
| 'BOT_OWNER'
| 'GUILD_OWNER';


class command {
    constructor(
        {
            name = "", 
            run = (client: myClient, msg: Message, args: string[]) => {},
            security = [], 
            aliases = [], parents = [], branches = [],
            category = '', description = '', usage = [],
            init,
            allow_args,
        }:{
            name: string, 
            run: (client: myClient, msg: Message, args:string[]) => void,
            security: security[], 
            aliases?:string[], parents?:string[], branches?:command[],
            category?:string, description?:string, usage?:string[],
            init?:(client: myClient) => void,
            allow_args?:(msg:Message, args:string[]) => boolean
        }) 
    {
        this.name = name;
        this.run = run;
        this.security = security;
        this.aliases = aliases;
        this.parents = parents;
        this._parents = [];
        this.branches = branches;
        this.category = category;
        this.description = description;
        this.usage = usage;
        this.init = init;
        this.allow_args = allow_args;
    }
    pretty_usage() {
        let content = this.getCallCommand();
        if(this.usage.length > 0)
            content += ` ${this.usage.join(' ')}`;
        return content;
    }
    getCallCommand() {
        if(this.parents.length > 0)
            return `${this.parents.join(' ')} ${this.name}`;
        else
            return this.name;
    }
}

interface command_handler {
    commands: command[];
    client: myClient;
    commandspath: string;
    init(): number;
    readCommands(path: string, basepath: string): command[];
    sort_commands(): void;
    apply_command(cmd: command, parentcmd?: command): void;
    resolve_command(cmd: string, args: string[], cmdobj?: command): {args: string[], command: command};
    valid_args(cmdobj: command, args: string[]): boolean;
    has_perms(client: myClient, cmdobj: command, msg: Message): boolean;
    resolve_run(client: myClient, msg: Message, cmd: string, args: string[]): Promise<void>;
}

class command_handler {
    constructor(_client:myClient, _commandspath: string) {
        this.client = _client;
        this.commandspath = _commandspath;
    }
    init() {
        this.client.commands.clear();
        this.commands = this.readCommands(this.commandspath, '');
        this.commands.forEach( command => command._parents = [...command.parents]);
        const nCmds = this.commands.length;
        this.sort_commands();
        return nCmds;
    }
    readCommands(path: string, basepath:string) {
        if(!path.endsWith('/')) path+= '/';
        let commands: command[] = [];
        const ls = fs.readdirSync(basepath + path);
        let dirs: string[] = [];
        let js: string[] = [];
        ls.forEach( s => {
            const lstat = fs.lstatSync(basepath+path+s);
            if(lstat.isFile() && s.endsWith('.js') && !s.startsWith('_'))
                js.push(s);
            else if (lstat.isDirectory())
                dirs.push(s);
        } );
        for(const dir of dirs) {
            commands = commands.concat(this.readCommands(dir, basepath+path));
        }
        for(const _js of js) {
            const cmd = require(`${process.cwd()}/${basepath}${path}${_js}`);
            if(cmd.cmd instanceof command)
            {
                let content: string;
                if(cmd.cmd.parents.length > 0)
                    content = `${this.client.commandprefix}${cmd.cmd.parents.join(' ')} ${cmd.cmd.name}`;
                else
                    content = `${this.client.commandprefix}${cmd.cmd.name}`;
                console.log(`${chalk.greenBright('Added command')}: ${chalk.magentaBright(content)} ${chalk.yellowBright(cmd.cmd.usage.join(' '))}`);
                commands.push(cmd.cmd);
            }
        }

        return commands;
    }
    sort_commands() {
        let sorted = this.commands.sort( (a, b) => a.parents.length - b.parents.length );
        while(sorted.length > 0)
        {
            let element = sorted.shift();
            if(element.init)
                element.init(this.client);
            this.apply_command(element);
        }
    }
    apply_command(cmd: command, parentcmd?: command) {
        if(typeof parentcmd === 'undefined' && cmd._parents.length === 0)
            this.client.commands.set(cmd.name, cmd);
        else if (cmd._parents.length !== 0) {
            let parent = cmd._parents.shift();
            if(typeof parentcmd === 'undefined')
                parentcmd = this.client.commands.get(parent);
            else
                parentcmd = parentcmd.branches.find((val) => val.name === parent);
            this.apply_command(cmd, parentcmd);
        }
        else {
            parentcmd.branches.push(cmd);
        }
    }
    resolve_command(cmd: string, args: string[], cmdobj?: command) {
        if(typeof cmdobj === 'undefined') {
            if(!this.client.commands.has(cmd)) 
            {
                cmdobj = this.client.commands.find( o => {
                    if(o.aliases.find( alias => alias === cmd)) return true;
                    return false;
                }); // Try to look for aliases
                if(!cmdobj) return null;
            }
            else
                cmdobj = this.client.commands.get(cmd);
        }
        if(cmdobj.branches.length === 0) 
            return {args: args, command: cmdobj};
        else
        {
            const brancharg = args.shift();
            let branchcmd = cmdobj.branches.find( o => o.name === brancharg );
            if(!branchcmd)
            {
                branchcmd = cmdobj.branches.find( o => {
                    if(o.aliases.find( alias => alias === brancharg)) return true;
                    return false;
                }); // Try to look for aliases
            }
            if(branchcmd)
                return this.resolve_command(`${cmd} ${brancharg}`, args, branchcmd);
            else
            {
                if(brancharg)
                    args.unshift(brancharg);
                return {args: args, command: cmdobj};
            }
        }
    }
    async resolve_run(client: myClient, msg: Message, cmd: string, args: string[]) {
        const res_cmd = this.resolve_command(cmd, args);
        let res_cmdobj: command;
        let res_cmdargs: string[];
        let isAlias = false;
        if(res_cmd) {
            res_cmdobj = res_cmd.command;
            res_cmdargs = res_cmd.args;
        } else if (client.aliases.has(msg.guild.id) && client.aliases.get(msg.guild.id).has(cmd)){
            const faliasargs = client.aliases.get(msg.guild.id).get(cmd).split(/ +/g).concat(args);
            const aliascmd = faliasargs.shift();
            const alias_res_cmd = this.resolve_command(aliascmd, faliasargs);
            if(alias_res_cmd) {
                isAlias = true;
                res_cmdobj = alias_res_cmd.command;
                res_cmdargs = alias_res_cmd.args;
            }
        }
        // Check for valid args and perms
        if(res_cmdobj && res_cmdargs) { // if both are defined
            if(this.has_perms(client, res_cmdobj, msg)) { // if user has perms
                if(!res_cmdobj.allow_args || res_cmdobj.allow_args(msg, res_cmdargs)) {
                    let log = `${chalk.redBright(`(${msg.guild.name})`)} ${chalk.greenBright(msg.author.username)} ⇶ ${chalk.magentaBright(client.commandprefix+res_cmdobj.getCallCommand())} ${chalk.yellowBright(res_cmdargs.join(' '))}`.trim();
                    res_cmdobj.run(client, msg, res_cmdargs);
                    if(isAlias)
                        log += ' ' + chalk.cyanBright(`[${client.commandprefix}${(cmd + ' ' + args.join(' ')).trim()}]`);
                    console.log(log);
                } else {
                    msg.channel.send(`Usage: \`${client.commandprefix}${res_cmdobj.pretty_usage()}\``);
                }
            }
            else { // User has no perms
                msg.reply(`Sorry, you do not have the following permissions.\n\`\`\`${res_cmdobj.security.join('\n')}\`\`\``);
            }
        } else {
            msg.channel.send(`Unknown command ${cmd}. Please check \`${client.commandprefix}help\`.`);
        }
    }
    has_perms(client: myClient, cmdobj: command, msg: Message) {
        let req_perms = [...cmdobj.security]; // Shallow copy
        const guildmember = msg.guild.member(msg);
        if(req_perms.includes('BOT_OWNER')) {
            req_perms.splice(req_perms.findIndex(perm => perm === 'BOT_OWNER'), 1);
            if(msg.author.id !== client.botownerid)
                return false;
        }
        if(req_perms.includes('DISABLED')) {
            req_perms.splice(req_perms.findIndex(perm => perm === 'DISABLED'), 1);
            return false;
        }
        if(req_perms.includes('GUILD_OWNER')) {
            req_perms.splice(req_perms.findIndex(perm => perm === 'GUILD_OWNER'), 1);
            if(msg.guild.ownerID !== msg.author.id)
                return false;
        }
        if(!guildmember.hasPermission(req_perms as PermissionString[])) {
            return false;
        }
        return true;
    }
}

/* Permission Model
        ADMINISTRATOR                   (implicitly has all permissions, and bypasses all channel overwrites)
        CREATE_INSTANT_INVITE           (create invitations to the guild)
        KICK_MEMBERS        
        BAN_MEMBERS     
        MANAGE_CHANNELS                 (edit and reorder channels)
        MANAGE_GUILD                    (edit the guild information, region, etc.)
        ADD_REACTIONS                   (add new reactions to messages)
        VIEW_AUDIT_LOG      
        PRIORITY_SPEAKER        
        STREAM      
        VIEW_CHANNEL        
        SEND_MESSAGES       
        SEND_TTS_MESSAGES       
        MANAGE_MESSAGES                 (delete messages and reactions)
        EMBED_LINKS                     (links posted will have a preview embedded)
        ATTACH_FILES        
        READ_MESSAGE_HISTORY            (view messages that were posted prior to opening Discord)
        MENTION_EVERYONE        
        USE_EXTERNAL_EMOJIS             (use emojis from different guilds)
        VIEW_GUILD_INSIGHTS     
        CONNECT                         (connect to a voice channel)
        SPEAK                           (speak in a voice channel)
        MUTE_MEMBERS                    (mute members across all voice channels)
        DEAFEN_MEMBERS                  (deafen members across all voice channels)
        MOVE_MEMBERS                    (move members between voice channels)
        USE_VAD                         (use voice activity detection)
        CHANGE_NICKNAME     
        MANAGE_NICKNAMES                (change other members' nicknames)
        MANAGE_ROLES
        MANAGE_WEBHOOKS
        MANAGE_EMOJIS
 */

export {command, command_handler};