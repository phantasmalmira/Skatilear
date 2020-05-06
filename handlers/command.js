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
        let commands = this.readCommands(this.commandspath, '');
    }
    async readCommands(path, basepath) {
        if (!path.endsWith('/'))
            path += '/';
        //let c_name_match = path.match(/[^\/]*\//g);
        //let c_name = c_name_match[c_name_match.length - 1];
        //c_name = c_name.substring(0, c_name.length -1);
        let commands = [];
        //let promises = [];
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
            commands = commands.concat(await this.readCommands(dir, basepath + path));
        }
        for (const _js of js) {
            //promises.push(import(basepath+path+_js).then( (cmd) => {
            //    commands.push(cmd.cmd);
            //} ))
            const cmd = await Promise.resolve().then(() => require(process.cwd() + '/' + basepath + path + _js));
            commands.push(cmd.cmd);
        }
        //Promise.all(promises);
        return commands;
    }
}
exports.command_handler = command_handler;
