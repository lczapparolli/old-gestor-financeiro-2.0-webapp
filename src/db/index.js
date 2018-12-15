//Libs
import Dexie from 'dexie';

const db = new Dexie('GestorFinanceiro');

db.version(1).stores({
    config: ''
});

export default db;