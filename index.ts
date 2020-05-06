import {JSONdb} from './handlers/jsondb';

const database = new JSONdb('./data');

console.log(database.db('some', ['somedir'], database.collections));