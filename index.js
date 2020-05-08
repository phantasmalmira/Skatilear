"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsondb_1 = require("./handlers/jsondb");
const Discord = require("discord.js");
const CMDS = require("./handlers/command");
const dotenv = require("dotenv");
class myClient extends Discord.Client {
    constructor(_authtoken, db_path, _commandprefix) {
        super();
        this.on('ready', this.on_ready);
        this.on('message', this.on_msg);
        this.authtoken = _authtoken;
        this.db = new jsondb_1.JSONdb(db_path);
        this.commandprefix = _commandprefix;
        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();
        this.cmd_handler = new CMDS.command_handler(this, './commands/');
        this.init_commands();
    }
    on_ready() {
        console.log(`Logged in as ${this.user.tag}!`);
    }
    async on_msg(msg) {
        if (msg.author.bot)
            return;
        if (!msg.content.startsWith(this.commandprefix))
            return;
        let args = msg.content.slice(client.commandprefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();
        this.cmd_handler.resolve_run(client, msg, cmd, args);
    }
    init_commands() {
        this.cmd_handler.init();
    }
    login() {
        return super.login(this.authtoken);
    }
}
exports.myClient = myClient;
dotenv.config();
const client = new myClient(process.env.d_AuthToken, './data/', '!');
client.login();
