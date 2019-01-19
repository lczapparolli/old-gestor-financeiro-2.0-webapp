import db from './index';

class Accounts {
    addAccount(account) {
        return db.accounts.put(account);
    }

    getAllAccounts() {
        return db.accounts.toArray();
    }

    getByName(name) {
        return db.accounts.where('name').equalsIgnoreCase(name).toArray();
    }
}

export default new Accounts();