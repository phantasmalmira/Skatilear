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
        if (typeof parentcmd === 'undefined' && cmd.parents.length === 0)
            this.client.commands.set(cmd.name, cmd);
        else if (cmd.parents.length !== 0) {
            let parent = cmd.parents.shift();
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
            if (!this.client.commands.has(cmd))
                return null;
            cmdobj = this.client.commands.get(cmd);
        }
        if (cmdobj.branches.length === 0)
            return { args, cmdobj };
        else {
            const brancharg = args.shift();
            const branchcmd = cmdobj.branches.find(o => o.name === brancharg);
            if (branchcmd)
                return this.resolve_command(`${cmd} ${brancharg}`, args, branchcmd);
            return null;
        }
    }
}
exports.command_handler = command_handler;
