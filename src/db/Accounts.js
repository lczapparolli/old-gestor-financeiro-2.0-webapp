import db from './index';
import Account from '../models/Account';

class Accounts {
    /**
     * Inserts or updates an Account. If `id` is provided, the account is updated
     * @param {Account} account The account object to be inserted or updated
     * @returns {Promise}
     */
    addAccount(account) {
        return db.accounts.put(account);
    }

    /**
     * Returns an array of accounts
     * @returns {Promise<Array<Account>>}
     */
    getAllAccounts() {
        return db.accounts.toArray();
    }

    /**
     * Searchs an account by its name.
     * @param {String} name The name of the account to be searched
     * @returns {Promise<Account>}
     */
    getByName(name) {
        return db.accounts.where('name').equalsIgnoreCase(name).toArray();
    }

    /**
     * Returns an account by its id.
     * @param {Number} id The id of the account
     * @returns {Promise<Account>}
     */
    getById(id) {
        return db.accounts.get(id);
    }
}

db.accounts.mapToClass(Account);

export default new Accounts();