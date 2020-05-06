"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsondb_1 = require("./handlers/jsondb");
const database = new jsondb_1.JSONdb('./data');
const mydb = database.db('some', ['somedir'], database.collections);
mydb.insert({'heya': 'bodoh'});
