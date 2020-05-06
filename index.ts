import {JSONdb} from './handlers/jsondb';
import * as Discord from 'discord.js';
import * as CMDS from './handlers/command';
import * as dotenv from 'dotenv';
import { stringify } from 'querystring';


interface myClient {
    db: JSONdb;
    authtoken: string;
    commandprefix: string;
    commands: Discord.Collection<string, CMDS.command>;
    aliases: Discord.Collection<string, string>;
    scheduleds: Discord.Collection<string, NodeJS.Timer>;
    cmd_handler: CMDS.command_handler;
    init_commands():void;
    on_ready():void;
    on_msg(msg: Discord.Message):void;
}

class myClient extends Discord.Client {
    constructor(_authtoken:string, db_path: string, _commandprefix: string){
        super();
        this.on('ready', this.on_ready);
        this.on('message', this.on_msg);
        this.authtoken = _authtoken;
        this.db = new JSONdb(db_path);
        this.commandprefix = _commandprefix;
        this.commands = new Discord.Collection<string, CMDS.command>();
        this.aliases = new Discord.Collection<string, string>();
        this.scheduleds = new Discord.Collection<string, NodeJS.Timer>();
        this.cmd_handler = new CMDS.command_handler(this, './commands/');
        this.init_commands();
    }
    on_ready() {
        console.log(`Logged in as ${this.user.tag}!`);
    }
    on_msg(msg: Discord.Message) {

    }
    init_commands() {
        this.cmd_handler.init();
    }
    login(){
        return super.login(this.authtoken);
    }
}
export {myClient};

dotenv.config();
const client = new myClient(process.env.d_AuthToken, './data/', '!');
client.login();