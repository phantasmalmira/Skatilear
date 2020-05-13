import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message, MessageEmbed, Collection } from 'discord.js';

interface MonitorClient extends myClient {
    guildMonitors: Collection<string, Collection<string, MonitorTask>>;
}

interface MonitorTask {
    name: string;
    host: string;
    port: number;
    task: NodeJS.Timer;
}

class MonitorTask {
    constructor(name: string, host: string, port: number, task?: NodeJS.Timer) {
        this.name = name;
        this.host = host;
        this.port = port;
        this.task = task;
    }
}

const cmd = new command(
    {
    name: 'service',
    run: async (client: MonitorClient, msg: Message, args: string[]) => {},
    security: [],
    aliases : ['svc'], 
    parents : [], 
    branches : [],
    category : 'Network', 
    description : '', 
    usage : ['<action: check | monitor>'],
    init : (client: MonitorClient) => {
        client.guildMonitors = new Collection();
    },
    allow_args: (msg: Message, args: string[]) => {return false;},
    }
)
export {cmd, MonitorClient, MonitorTask};