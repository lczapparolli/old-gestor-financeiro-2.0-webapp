//Libs
import Dexie from 'dexie';

const db = new Dexie('GestorFinanceiro');

db.version(1).stores({
    config: '',
    accounts: '++id,&name,type',
    forecasts_categories: '++id,&name,type',
    forecasts: '++id,category_id,&name'
});

db.on('populate', () => {
    const initialCategories = [
        { name: 'Incomes', type: 'incomes' },
        { name: 'Predicted', type: 'predicted' },
        { name: 'Unpredicted', type: 'unpredicted' },
    ];
    initialCategories.map(category => db.forecasts_categories.add(category));
});

db.open();

export default db;
