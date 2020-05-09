import { Message } from "discord.js";
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
    security: string[];
    run(client: myClient, msg: Message, args: string[]): void;
    init(client: myClient): void;
}

class command {
    constructor(
        {
            _name = "", 
            _run = (client: myClient, msg: Message, args: string[]) => {},
            _security = [], 
            _aliases = [], _parents = [], _branches = [],
            _category = '', _description = '', _usage = [],
            _init = (client: myClient) => {}
        }:{
            _name: string, 
            _run: (client: myClient, msg: Message, args:string[]) => void,
            _security: string[], 
            _aliases?:string[], _parents?:string[], _branches?:command[],
            _category?:string, _description?:string, _usage?:string[],
             _init?:(client: myClient) => void
        }) 
    {
        this.name = _name;
        this.run = _run;
        this.security = _security;
        this.aliases = _aliases;
        this.parents = _parents;
        this._parents = [];
        this.branches = _branches;
        this.category = _category;
        this.description = _description;
        this.usage = _usage;
        this.init = _init;
    }
}

interface command_handler {
    commands: command[];
    client: myClient;
    commandspath: string;
    init(): void;
    readCommands(path: string, basepath: string): command[];
    sort_commands(): void;
    apply_command(cmd: command, parentcmd?: command): void;
    resolve_command(cmd: string, args: string[], cmdobj?: command): {args: string[], command: command};
    valid_args(cmdobj: command, args: string[]): boolean;
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
        this.sort_commands();
    }
    readCommands(path: string, basepath:string) {
        if(!path.endsWith('/')) path+= '/';
        let commands: command[] = [];
        const ls = fs.readdirSync(basepath + path);
        let dirs: string[] = [];
        let js: string[] = [];
        ls.forEach( s => {
            const lstat = fs.lstatSync(basepath+path+s);
            if(lstat.isFile() && s.endsWith('.js'))
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
        const run = this.resolve_command(cmd, args);
        if(run && this.valid_args(run.command, run.args))
            run.command.run(client, msg, run.args);
        else {
            let content: string;
            if(run.command.parents.length > 0)
                content = `${client.commandprefix}${run.command.parents.join(' ')} ${run.command.name} ${run.command.usage.join(' ')}`;
            else
                content = `${client.commandprefix}${run.command.name} ${run.command.usage.join(' ')}`;
            msg.channel.send(`Usage: \`${content}\``);
        }
    }
    valid_args(cmdobj: command, args: string[]) {
        const usage = cmdobj.usage;
        let reqargs = 0;
        usage.forEach( u => {if (!u.includes('?')) ++reqargs;} );
        if(args.length < reqargs) return false;
        for(let i = 0; i < args.length; ++i) {
            const arg = args[i];
            const u_req = usage[i];
            if(!u_req) break; //undefined usage req for this arg, out-of-bounds
            if(!u_req.includes(':')) continue; //no special req for this arg
            const u_format = u_req.substring(u_req.indexOf(':') + 1, u_req.length - 1).trim();
            const u_req_format = u_format.match(/\w*[^ \|]/g);
            let allowed = true;
            for(const _f of u_req_format) {
                if( _f === '_int' && !isNaN( parseInt(arg) ) ) allowed = true; // args is req to be int
                else if (!(arg.toLowerCase() === _f)) allowed = false;
                else allowed = true;
                if(allowed) break;
            }
            if(allowed) continue;
            return false;
        }
        return true;
    }
}

export {command, command_handler};