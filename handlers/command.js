"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
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
        const nCmds = this.commands.length;
        this.sort_commands();
        return nCmds;
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
            if (cmd.cmd instanceof command) {
                let content;
                if (cmd.cmd.parents.length > 0)
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
        let sorted = this.commands.sort((a, b) => a.parents.length - b.parents.length);
        while (sorted.length > 0) {
            let element = sorted.shift();
            element.init(this.client);
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
        const res_cmd = this.resolve_command(cmd, args);
        let res_cmdobj;
        let res_cmdargs;
        if (res_cmd) {
            res_cmdobj = res_cmd.command;
            res_cmdargs = res_cmd.args;
        }
        else if (client.aliases.has(cmd)) {
            const faliasargs = client.aliases.get(cmd).split(/ +/g).concat(args);
            const aliascmd = faliasargs.shift();
            const alias_res_cmd = this.resolve_command(aliascmd, faliasargs);
            if (alias_res_cmd) {
                res_cmdobj = alias_res_cmd.command;
                res_cmdargs = alias_res_cmd.args;
            }
        }
        // Check for valid args and perms
        if (res_cmdobj && res_cmdargs) { // if both are defined
            if (this.has_perms(client, res_cmdobj, msg)) { // if user has perms
                if (this.valid_args(res_cmdobj, res_cmdargs)) {
                    res_cmdobj.run(client, msg, res_cmdargs);
                }
                else {
                    let content;
                    if (res_cmdobj.parents.length > 0)
                        content = `${client.commandprefix}${res_cmdobj.parents.join(' ')} ${res_cmdobj.name} ${res_cmdobj.usage.join(' ')}`;
                    else
                        content = `${client.commandprefix}${res_cmdobj.name} ${res_cmdobj.usage.join(' ')}`;
                    msg.channel.send(`Usage: \`${content}\``);
                }
            }
            else { // User has no perms
                msg.reply(`Sorry, you do not have the following permissions.\n\`\`\`${res_cmdobj.security.join('\n')}\`\`\``);
            }
        }
        else {
            msg.channel.send(`Unknown command ${cmd}. Please check \`${client.commandprefix}help\`.`);
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
                if (_f === '_int' && !isNaN(parseInt(arg)))
                    allowed = true; // args is req to be int
                else if (!(arg.toLowerCase() === _f))
                    allowed = false;
                else
                    allowed = true;
                if (allowed)
                    break;
            }
            if (allowed)
                continue;
            return false;
        }
        return true;
    }
    has_perms(client, cmdobj, msg) {
        let req_perms = [...cmdobj.security]; // Shallow copy
        const guildmember = msg.guild.member(msg);
        while (req_perms.length > 0) {
            const cur_perm = req_perms.shift();
            if (cur_perm === 'BOT_OWNER') {
                if (msg.author.id !== client.botownerid)
                    return false;
            }
            else if (cur_perm === 'DISABLED') {
                return false;
            }
            else {
                const discord_perm = cur_perm;
                if (!msg.guild.member(msg).hasPermission(discord_perm))
                    return false;
            }
        }
        return true;
    }
}
exports.command_handler = command_handler;
