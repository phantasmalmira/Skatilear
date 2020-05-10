import {JSONCollections, JSONdb} from './jsondb';

interface settings {
    db: JSONdb;
    globaldb: JSONCollections;
    getSetting(key: string, guildid?: string): string;
    setGuildSetting(guildid: string, key: string, value: string): void;
    setGlobalSetting(key: string, value: string): void;
    delGuildSetting(key: string, guildid: string): boolean;
    delGlobalSetting(key: string): boolean;
    getGuildSetting(key:string, guildid: string): string;
    getGlobalSetting(key:string): string;
}


class settings {
    constructor(db: JSONdb) {
        this.db = db;
        this.globaldb = this.db.db('global', {traversepath: ['settings']});
    }
    getSetting(key: string, guildid?: string) {
        let guildvalue;
        if(typeof guildid !== 'undefined')
            guildvalue = this.getGuildSetting(key, guildid);
        else guildvalue = null;
        let globalvalue = this.getGlobalSetting(key);
        if(guildvalue) return globalvalue
        else if(globalvalue) return globalvalue;
        else return null;
    }
    setGuildSetting(guildid: string, key: string, value: string) {
        const guilddb = this.db.db(guildid, {traversepath: ['settings']});
        const guildsetting = guilddb.find({key: key});
        if(guildsetting) {
            guildsetting.value = value;
        } else {
            guilddb.insert({key: key, value: value});
        }
    }
    setGlobalSetting(key: string, value: string) {
        const globalsetting = this.globaldb.find({key: key});
        if(globalsetting) {
            globalsetting.value = value;
        } else {
            this.globaldb.insert({key: key, value: value});
        }
    }
    delGuildSetting(key: string, guildid: string) {
        const guilddb = this.db.db(guildid, {traversepath: ['settings']});
        const guildsetting = guilddb.find({key: key});
        if(guildsetting) {
            guilddb.delete(guildsetting);
            return true;
        }
        return false;
    }
    delGlobalSetting(key: string) {
        const globalsetting = this.globaldb.find({key: key});
        if(globalsetting) {
            this.globaldb.delete(globalsetting);
            return true;
        }
        return false;
    }
    getGuildSetting(key:string, guildid: string) {
        const guilddb = this.db.db(guildid, {traversepath: ['settings']});
        const guildsetting = guilddb.find({key: key});
        if(guildsetting)
            return guildsetting.value;
        return null;
    }
    getGlobalSetting(key:string) {
        const globalsetting = this.globaldb.find({key: key});
        if(globalsetting)
            return globalsetting.value;
        return null;
    }
}

export {settings};