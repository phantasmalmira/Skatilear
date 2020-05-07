"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class command {
    constructor({ _name = "", _run = (client, msg, args) => { }, _security = [], _aliases = [], _parents = [], _branches = [], _category = '', _description = '', _usage = [], _init = (client) => { } }) {
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
exports.command = command;
class command_handler {
    constructor(_client, _commandspath) {
        this.client = _client;
        this.commandspath = _commandspath;
    }
    init() {
        this.client.commands.clear();
        this.commands = this.readCommands(this.commandspath, '');
        this.commands.forEach(command => command._parents = [...command.parents]);
        this.sort_commands();
    }
    readCommands(path, basepath) {
        if (!path.endsWith('/'))
            path += '/';
        let commands = [];
        const ls = fs.readdirSync(basepath + path);
        let dirs = [];
        let js = [];
        ls.forEach(s => {
            const lstat = fs.lstatSync(basepath + path + s);
            if (lstat.isFile() && s.endsWith('.js'))
                js.push(s);
            else if (lstat.isDirectory())
                dirs.push(s);
        });
        for (const dir of dirs) {
            commands = commands.concat(this.readCommands(dir, basepath + path));
        }
        for (const _js of js) {
            const cmd = require(`${process.cwd()}/${basepath}${path}${_js}`);
            if (cmd.cmd instanceof command)
                commands.push(cmd.cmd);
        }
        return commands;
    }
    sort_commands() {
        let sorted = this.commands.sort((a, b) => a.parents.length - b.parents.length);
        while (sorted.length > 0) {
            let element = sorted.shift();
            this.apply_command(element);
        }
    }
    apply_command(cmd, parentcmd) {
        if (typeof parentcmd === 'undefined' && cmd._parents.length === 0)
            this.client.commands.set(cmd.name, cmd);
        else if (cmd._parents.length !== 0) {
            let parent = cmd._parents.shift();
            if (typeof parentcmd === 'undefined')
                parentcmd = this.client.commands.get(parent);
            this.apply_command(cmd, parentcmd);
        }
        else {
            parentcmd.branches.push(cmd);
        }
    }
    resolve_command(cmd, args, cmdobj) {
        if (typeof cmdobj === 'undefined') {
            if (!this.client.commands.has(cmd)) {
                cmdobj = this.client.commands.find(o => {
                    if (o.aliases.find(alias => alias === cmd))
                        return true;
                    return false;
                }); // Try to look for aliases
                if (!cmdobj)
                    return null;
            }
            else
                cmdobj = this.client.commands.get(cmd);
        }
        if (cmdobj.branches.length === 0)
            return { args: args, command: cmdobj };
        else {
            const brancharg = args.shift();
            let branchcmd = cmdobj.branches.find(o => o.name === brancharg);
            if (!branchcmd) {
                branchcmd = cmdobj.branches.find(o => {
                    if (o.aliases.find(alias => alias === brancharg))
                        return true;
                    return false;
                }); // Try to look for aliases
            }
            if (branchcmd)
                return this.resolve_command(`${cmd} ${brancharg}`, args, branchcmd);
            else {
                if (brancharg)
                    args.unshift(brancharg);
                return { args: args, command: cmdobj };
            }
        }
    }
    async resolve_run(client, msg, cmd, args) {
        const run = this.resolve_command(cmd, args);
        if (this.valid_args(run.command, run.args))
            run.command.run(client, msg, run.args);
        else {
            let content;
            if (run.command.parents.length > 0)
                content = `${client.commandprefix}${run.command.parents.join(' ')} ${run.command.name} ${run.command.usage.join(' ')}`;
            else
                content = `${client.commandprefix}${run.command.name} ${run.command.usage.join(' ')}`;
            msg.channel.send(`Usage: \`${content}\``);
        }
    }
    valid_args(cmdobj, args) {
        const usage = cmdobj.usage;
        let reqargs = 0;
        usage.forEach(u => { if (!u.includes('?'))
            ++reqargs; });
        if (args.length < reqargs)
            return false;
        for (let i = 0; i < args.length; ++i) {
            const arg = args[i];
            const u_req = usage[i];
            if (!u_req)
                break; //undefined usage req for this arg, out-of-bounds
            if (!u_req.includes(':'))
                continue; //no special req for this arg
            const u_format = u_req.substring(u_req.indexOf(':') + 1, u_req.length - 1).trim();
            const u_req_format = u_format.match(/\w*[^ \|]/g);
            let allowed = true;
            for (const _f of u_req_format) {
                if (_f === '_int' && isNaN(parseInt(arg)))
                    return false; // args is req to be int
                else if (!(arg.toLowerCase() === _f))
                    allowed = false;
                else
                    allowed = true;
                if (allowed)
                    break;
                return false;
            }
            if (allowed)
                continue;
            return false;
        }
        return true;
    }
}
exports.command_handler = command_handler;
