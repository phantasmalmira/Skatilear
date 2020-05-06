import {JSONdb} from './handlers/jsondb';
import * as Discord from 'discord.js';
import * as CMDS from './handlers/command';
import * as dotenv from 'dotenv';
dotenv.config();

interface myClient {
    db: JSONdb;
    authtoken: string;
    commandprefix: string;
    commands: Discord.Collection<string, CMDS.command>;
    aliases: Discord.Collection<string, string>;
    scheduleds: Discord.Collection<string, NodeJS.Timer>;
    init_commands():void;
    on_ready():void;
}

class myClient extends Discord.Client {
    constructor(){
        super();
        this.on('ready', this.on_ready);
        this.authtoken = process.env.d_AuthToken;
    }
    on_ready() {
        console.log(`Logged in as ${this.user.tag}!`);
    }
    init_commands() {

    }
}