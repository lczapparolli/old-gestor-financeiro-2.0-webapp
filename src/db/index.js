//Libs
import Dexie from 'dexie';

const db = new Dexie('GestorFinanceiro');

db.version(1).stores({
    config: '',
    accounts: '++id,&name,type'
});

db.version(2).stores({
    forecasts_categories: '++id,&name,type'
});

db.open();

export default db;