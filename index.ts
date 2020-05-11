import {JSONdb} from './handlers/jsondb';
import {settings} from './handlers/setting';
import * as Chalk from 'chalk';
import * as Discord from 'discord.js';
import * as CMDS from './handlers/command';
import * as dotenv from 'dotenv';


interface myClient {
    db: JSONdb;
    authtoken: string;
    botownerid: string;
    commandprefix: string;
    commands: Discord.Collection<string, CMDS.command>;
    aliases: Discord.Collection<string, Discord.Collection<string, string>>;
    cmd_handler: CMDS.command_handler;
    settings: settings;
    init_commands():number;
    on_ready():void;
    on_msg(msg: Discord.Message):void;
}

class myClient extends Discord.Client {
    constructor(_authtoken:string, _botownerid: string, db_path: string, _commandprefix: string){
        super();
        this.on('ready', this.on_ready);
        this.on('message', this.on_msg);
        this.authtoken = _authtoken;
        this.botownerid = _botownerid;
        this.db = new JSONdb(db_path);
        this.settings = new settings(this.db);
        this.commandprefix = _commandprefix;
        this.commands = new Discord.Collection<string, CMDS.command>();
        this.aliases = new Discord.Collection<string, Discord.Collection<string, string>>();
        this.cmd_handler = new CMDS.command_handler(this, './commands/');
        this.init_commands();
    }
    on_ready() {
        console.log(`Logged in as ${this.user.tag}!`);
    }
    async on_msg(msg: Discord.Message) {
        if(msg.author.bot) return;
        if(!msg.content.startsWith(this.commandprefix)) return;
        let args = msg.content.slice(client.commandprefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();
        console.log(`${Chalk.redBright(`(${msg.guild.name})`)} ${Chalk.greenBright(msg.author.username)} ⇶ ${Chalk.yellowBright(this.commandprefix)}${Chalk.magentaBright(`${cmd} ${args.join(' ')}`)}`);
        this.cmd_handler.resolve_run(client, msg, cmd, args);
    }
    init_commands() {
        return this.cmd_handler.init();
    }
    login(){
        return super.login(this.authtoken);
    }
}
export {myClient};

dotenv.config();
const client = new myClient(process.env.d_AuthToken, process.env.d_BotOwner,'./data/', '!');
client.login();