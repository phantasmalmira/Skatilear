import * as fs from 'fs';
import * as _ from 'lodash';

interface JSONdb {
    dbpath: string;
    collections: dbCollections;
    readCollection(path:string, basepath:string): dbCollections;
    db(db_name:string, {traversepath, createIfMissing}: {traversepath?: string[], createIfMissing?:boolean}): JSONCollections;
    _db(db_name:string, traversepath: string[], nextCollection: dbCollections): JSONCollections;
    _create_db(db_name: string, traversepath: string[], nextCollection: dbCollections, path?: string): JSONCollections;
}

const JSONdb = class {
    constructor(dbpath:string) {
        this.dbpath = dbpath;
        this.collections = this.readCollection(this.dbpath, '');
    }
    readCollection(path:string, basepath:string) {
        if(!path.endsWith('/')) path += '/';
        let c_name_match = path.match(/[^\/]*\//g);
        let c_name = c_name_match[c_name_match.length - 1];
        c_name = c_name.substring(0, c_name.length -1);
        let c_collection = new dbCollections(c_name);
        const ls = fs.readdirSync(basepath+path);
        let dirs:string[] = [];
        let jsons:string[] = [];
        ls.forEach( s => {
            const lstat = fs.lstatSync(basepath+path+s);
            if(lstat.isFile() && s.endsWith('.json'))
                jsons.push(s);
            else if (lstat.isDirectory())
                dirs.push(s);
        } );
        for (const dir of dirs) {
            c_collection.branch.push(this.readCollection(dir, basepath+path));
        }
        for (const json of jsons) {
            c_collection.base.push(new JSONCollections(basepath+path+json, json.substring(0, json.length - 5)));
        }
        return c_collection;
    }
    db(db_name:string, {traversepath=[], createIfMissing=true}: {traversepath?: string[], createIfMissing?:boolean} = {}) {
        if(createIfMissing)
            return this._create_db(db_name, traversepath, this.collections);
        else
            return this._db(db_name, traversepath, this.collections);
    }
    _db(db_name:string, traversepath: string[] ,nextCollection: dbCollections) {
        if(traversepath.length !== 0)
        {
            const nextlayer = traversepath.shift();
            const nextlayerIndex = nextCollection.branch.findIndex( branch => branch.name === nextlayer );
            if(nextlayerIndex === -1) throw "TraversePathInvalid";
            return this._db(db_name, traversepath, nextCollection.branch[nextlayerIndex]);
        }
        else {
            const targetdb = nextCollection.base.findIndex( collection => collection.cname === db_name);
            if(targetdb === -1) throw "DBNotFound";
            return nextCollection.base[targetdb];
        }
    }
    _create_db(db_name: string, traversepath: string[], nextCollection: dbCollections, path?: string) {
        if(typeof path === 'undefined')
            path = `${this.dbpath}/${traversepath.join('/')}/${db_name}.json`;
        if(traversepath.length !== 0)
        {
            const nextlayer = traversepath.shift();
            let nextlayerIndex = nextCollection.branch.findIndex( branch => branch.name === nextlayer );
            if(nextlayerIndex === -1) //branch not found
            {
                nextCollection.branch.push(new dbCollections(nextlayer));
                nextlayerIndex = nextCollection.branch.length - 1;
            }
            return this._create_db(db_name, traversepath, nextCollection.branch[nextlayerIndex], path);
        }
        else {
            let targetdb = nextCollection.base.findIndex( collection => collection.cname === db_name);
            if(targetdb === -1) // db not found
            {
                nextCollection.base.push(new JSONCollections(path, db_name));
                targetdb = nextCollection.base.length - 1;
            }
            return nextCollection.base[targetdb];
        }
    }
}

interface dbCollections {
    name: string;
    base: Array<JSONCollections>;
    branch: Array<dbCollections>;
}

const dbCollections = class {
    constructor(_name: string) {
        this.name = _name;
        this.base = [];
        this.branch = [];
    }
}

interface JSONCollections {
    cpath: string;
    cname: string;
    cdata: object[];
    data: object[];
    update_db(): boolean;
    insert(item: object): boolean;
    delete(item: object): boolean;
    filter(query: object): object[];
    filterIndex(query: object): number[];
    find(query: object): object[];
    findIndex(query: object): number;
    replace(query: object, vals: object): boolean;
    replaceAll(query: object, vals: object): boolean;
    forEach(callback: (arg0: object) => void): void;
    forEachIf(query: object, callback: (arg0: object) => void): void;
    rowSetHandler(target, prop, value, receiver): boolean;
}

const JSONCollections = class {
    constructor(path: string, name: string) {
        this.cpath = path;
        this.cname = name;
        this.data = [];
        if(!fs.existsSync(this.cpath))
        {
            const dir = this.cpath.substring(0, this.cpath.length - 5 - this.cname.length);
            if(!fs.existsSync(dir))
                fs.mkdirSync(dir, {recursive: true});
            fs.writeFileSync(this.cpath, '[]');
        }
        this.cdata = JSON.parse(fs.readFileSync(this.cpath).toString());
        this.cdata.forEach( e => {
            this.data.push(new Proxy(e, {set: this.rowSetHandler}))
        } , this);
    }
    update_db() {
        try {
            fs.writeFileSync(this.cpath, JSON.stringify(this.cdata));
            return true;
        }
        catch (e)
        {
            console.log(e);
            return false;
        }
    }
    insert(item: object) {
        this.cdata.push(item);
        this.data.push(new Proxy(item, {set: this.rowSetHandler}));
        return this.update_db();
    }
    delete(item: object) {
        let index = this.cdata.findIndex( data => _.isEqual(data, item) );
        if (index === -1) return false;
        this.cdata.splice(index, 1);
        this.data.splice(index, 1);
        return this.update_db();
    }
    filter(query: object) {
        let query_k = Object.keys(query);
        let result_f = this.data.filter( element => {
            for( const _k of query_k ) {
                if (!element.hasOwnProperty(_k)) return false;
                let _q = query[_k];
                if(_q instanceof RegExp) {
                    if( ( element[_k].toString().match(_q) || [] ).length === 0)
                        return false;
                }
                else {
                    if( element[_k] !== _q )
                        return false;
                }
            }
            return true;
        } );
        return result_f;
    }
    filterIndex(query: object) {
        let result_q = this.filter(query);
        let result_i: number[];
        for (const result of result_q) 
            result_i.push(this.cdata.findIndex( element => _.isEqual(element, result) ));
        return result_i;
    }
    find(query: object) {
        let query_k = Object.keys(query);
        let result_f = this.data.find( element => {
            for( const _k of query_k ) {
                if (!element.hasOwnProperty(_k)) return false;
                let _q = query[_k];
                if(_q instanceof RegExp) {
                    if( ( element[_k].toString().match(_q) || [] ).length === 0)
                        return false;
                }
                else {
                    if( element[_k] !== _q )
                        return false;
                }
            }
            return true;
        } );
        return result_f;
    }
    findIndex(query: object) {
        let query_k = Object.keys(query);
        let result_i = this.cdata.findIndex( element => {
            for( const _k of query_k ) {
                if (!element.hasOwnProperty(_k)) return false;
                let _q = query[_k];
                if(_q instanceof RegExp) {
                    if( ( element[_k].toString().match(_q) || [] ).length === 0)
                        return false;
                }
                else {
                    if( element[_k] !== _q )
                        return false;
                }
            }
            return true;
        } );
        return result_i;
    }
    replace(query: object, vals: object) {
        let query_i = this.findIndex(query);
        if (query_i === -1 ) return false;

        let r_keys = Object.keys(vals);

        for (const key of r_keys) 
            this.cdata[query_i][key] = vals[key];

        return this.update_db();
    }
    replaceAll(query: object, vals: object) {
        let query_i = this.filterIndex(query);
        if(query_i.length === 0) return false;
        let r_keys = Object.keys(vals);

        for(const index of query_i) {
            for(const _r of r_keys)
                this.cdata[index][_r] = vals[_r];
        }
        return this.update_db();
    }
    forEach(callback: (arg0: object) => void) {
        this.data.forEach(callback);
    }
    forEachIf(query: object, callback: (arg0: object) => void) {
        let query_i = this.filterIndex(query);
        for( const i of query_i )
            callback(this.data[i]);
    }
    rowSetHandler(target, prop, value, receiver) {
        Reflect.set(target, prop, value);
        this.update_db();
        return true;
    }
}

export {JSONdb};