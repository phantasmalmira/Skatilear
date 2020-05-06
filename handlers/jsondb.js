"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _ = require("lodash");
const JSONdb = class {
    constructor(dbpath) {
        this.dbpath = dbpath;
        this.collections = this.readCollection(this.dbpath, '');
    }
    readCollection(path, basepath) {
        if (!path.endsWith('/'))
            path += '/';
        let c_name_match = path.match(/[^\/]*\//g);
        let c_name = c_name_match[c_name_match.length - 1];
        c_name = c_name.substring(0, c_name.length - 1);
        let c_collection = new dbCollections(c_name);
        const ls = fs.readdirSync(basepath + path);
        let dirs = [];
        let jsons = [];
        ls.forEach(s => {
            const lstat = fs.lstatSync(basepath + path + s);
            if (lstat.isFile() && s.endsWith('.json'))
                jsons.push(s);
            else if (lstat.isDirectory())
                dirs.push(s);
        });
        for (const dir of dirs) {
            c_collection.branch.push(this.readCollection(dir, basepath + path));
        }
        for (const json of jsons) {
            c_collection.base.push(new JSONCollections(basepath + path + json, json.substring(0, json.length - 5)));
        }
        return c_collection;
    }
    db(db_name, traversepath, nextCollection) {
        if (traversepath.length !== 0) {
            const nextlayer = traversepath.shift();
            const nextlayerIndex = nextCollection.branch.findIndex(branch => branch.name === nextlayer);
            return this.db(db_name, traversepath, nextCollection.branch[nextlayerIndex]);
        }
        else {
            const targetdb = nextCollection.base.find(collection => collection.cname === db_name);
            return targetdb;
        }
    }
};
exports.JSONdb = JSONdb;
const dbCollections = class {
    constructor(_name) {
        this.name = _name;
        this.base = [];
        this.branch = [];
    }
};
const JSONCollections = class {
    constructor(path, name) {
        this.cpath = path;
        this.cname = name;
        this.cdata = JSON.parse(fs.readFileSync(this.cpath).toString());
    }
    update_db() {
        try {
            fs.writeFileSync(this.cpath, JSON.stringify(this.cdata));
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    insert(item) {
        this.cdata.push(item);
        return this.update_db();
    }
    delete(item) {
        let index = this.cdata.findIndex(data => _.isEqual(data, item));
        if (index === -1)
            return false;
        this.cdata.splice(index, 1);
        return this.update_db();
    }
    filter(query) {
        let query_k = Object.keys(query);
        let result_f = this.cdata.filter(element => {
            for (const _k of query_k) {
                if (!element.hasOwnProperty(_k))
                    return false;
                let _q = query[_k];
                if (_q instanceof RegExp) {
                    if ((element[_k].toString().match(_q) || []).length === 0)
                        return false;
                }
                else {
                    if (element[_k] !== _q)
                        return false;
                }
            }
            return true;
        });
        return result_f;
    }
    filterIndex(query) {
        let result_q = this.filter(query);
        let result_i;
        for (const result of result_q)
            result_i.push(this.cdata.findIndex(element => _.isEqual(element, result)));
        return result_i;
    }
    find(query) {
        let query_k = Object.keys(query);
        let result_f = this.cdata.find(element => {
            for (const _k of query_k) {
                if (!element.hasOwnProperty(_k))
                    return false;
                let _q = query[_k];
                if (_q instanceof RegExp) {
                    if ((element[_k].toString().match(_q) || []).length === 0)
                        return false;
                }
                else {
                    if (element[_k] !== _q)
                        return false;
                }
            }
            return true;
        });
        return result_f;
    }
    findIndex(query) {
        let query_k = Object.keys(query);
        let result_i = this.cdata.findIndex(element => {
            for (const _k of query_k) {
                if (!element.hasOwnProperty(_k))
                    return false;
                let _q = query[_k];
                if (_q instanceof RegExp) {
                    if ((element[_k].toString().match(_q) || []).length === 0)
                        return false;
                }
                else {
                    if (element[_k] !== _q)
                        return false;
                }
            }
            return true;
        });
        return result_i;
    }
    replace(query, vals) {
        let query_i = this.findIndex(query);
        if (query_i === -1)
            return false;
        let r_keys = Object.keys(vals);
        for (const key of r_keys)
            this.cdata[query_i][key] = vals[key];
        return this.update_db();
    }
    replaceAll(query, vals) {
        let query_i = this.filterIndex(query);
        if (query_i.length === 0)
            return false;
        let r_keys = Object.keys(vals);
        for (const index of query_i) {
            for (const _r of r_keys)
                this.cdata[index][_r] = vals[_r];
        }
        return this.update_db();
    }
    forEach(callback) {
        this.cdata.forEach(callback);
    }
    forEachIf(query, callback) {
        let query_i = this.filterIndex(query);
        for (const i of query_i)
            callback(this.cdata[i]);
    }
};
