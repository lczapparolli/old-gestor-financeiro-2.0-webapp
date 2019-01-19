import db from './index';

class Accounts {
    addAccount(account) {
        return db.accounts.put(account);
    }

    getAllAccounts() {
        return db.accounts.toArray();
    }
}

export default new Accounts();