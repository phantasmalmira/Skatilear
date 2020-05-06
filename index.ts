import {JSONdb} from './handlers/jsondb';

const database = new JSONdb('./data');

const mydb = database.db('some', {traversepath:['somedir']});
mydb.insert({hello:'YIkeS', 'Wow': 'hahaha'});
console.log(mydb.cdata);