"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class settings {
    constructor(db) {
        this.db = db;
        this.globaldb = this.db.db('global', { traversepath: ['settings'] });
    }
    getSetting(key, guildid) {
        let guildvalue;
        if (typeof guildid !== 'undefined')
            guildvalue = this.getGuildSetting(key, guildid);
        else
            guildvalue = null;
        let globalvalue = this.getGlobalSetting(key);
        if (guildvalue)
            return globalvalue;
        else if (globalvalue)
            return globalvalue;
        else
            return null;
    }
    setGuildSetting(guildid, key, value) {
        const guilddb = this.db.db(guildid, { traversepath: ['settings'] });
        const guildsetting = guilddb.find({ key: key });
        if (guildsetting) {
            guildsetting.value = value;
        }
        else {
            guilddb.insert({ key: key, value: value });
        }
    }
    setGlobalSetting(key, value) {
        const globalsetting = this.globaldb.find({ key: key });
        if (globalsetting) {
            globalsetting.value = value;
        }
        else {
            this.globaldb.insert({ key: key, value: value });
        }
    }
    delGuildSetting(key, guildid) {
        const guilddb = this.db.db(guildid, { traversepath: ['settings'] });
        const guildsetting = guilddb.find({ key: key });
        if (guildsetting) {
            guilddb.delete(guildsetting);
            return true;
        }
        return false;
    }
    delGlobalSetting(key) {
        const globalsetting = this.globaldb.find({ key: key });
        if (globalsetting) {
            this.globaldb.delete(globalsetting);
            return true;
        }
        return false;
    }
    getGuildSetting(key, guildid) {
        const guilddb = this.db.db(guildid, { traversepath: ['settings'] });
        const guildsetting = guilddb.find({ key: key });
        if (guildsetting)
            return guildsetting.value;
        return null;
    }
    getGlobalSetting(key) {
        const globalsetting = this.globaldb.find({ key: key });
        if (globalsetting)
            return globalsetting.value;
        return null;
    }
}
exports.settings = settings;
