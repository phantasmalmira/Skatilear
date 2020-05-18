import {command} from '../../handlers/command';
import {myClient} from '../../index';
import { Message, MessageEmbed, Collection } from 'discord.js';

interface MonitorClient extends myClient {
    guildMonitors: Collection<string, Collection<string, MonitorTask>>;
    guildDLMonitors: Collection<string, Collection<string, DLMonitorTask>>;
}

interface DLMonitorTask {
    name: string;
    url: string;
    task: NodeJS.Timer;
}

class DLMonitorTask {
    constructor(name: string, url: string, task?: NodeJS.Timer) {
        this.name = name;
        this.url = url;
        this.task = task;
    }
}

interface MonitorTask {
    name: string;
    host: string;
    port: number;
    task: NodeJS.Timer;
    lastChanged: Date;
}

class MonitorTask {
    constructor(name: string, host: string, port: number, task?: NodeJS.Timer, lastChanged?: Date) {
        this.name = name;
        this.host = host;
        this.port = port;
        this.task = task;
        this.lastChanged = lastChanged;
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
    usage : ['<action: check | monitor | list | remove>'],
    init : (client: MonitorClient) => {
        client.guildMonitors = new Collection();
        client.guildDLMonitors = new Collection();
    },
    allow_args: (msg: Message, args: string[]) => {return false;},
    }
)
export {cmd, MonitorClient, MonitorTask, DLMonitorTask};