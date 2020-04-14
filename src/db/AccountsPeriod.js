import db from './index';
import AccountPeriod from '../models/AccountPeriod';

class AccountsPeriod {

    /**
     * Insert or updates an AccountPeriod into the database. If `id` is provided then it is updated.
     * This method returns the id of the stored object.
     * @param {AccountPeriod} accountPeriod The object to be stored into database
     * @returns {Promise<Number>} The id of the object
     */
    saveAccountPeriod(accountPeriod) {
        return db.accounts_period.put(accountPeriod);
    }

    /**
     * Returns an accountPeriod related to account and period.
     * @param {Number} accountId The id of the account
     * @param {Number} period The period of the balance
     * @returns {Promise<AccountPeriod>} Returns the correspondent accountPeriod object
     */
    getByAccountPeriod(accountId, period) {
        return db.accounts_period.where({ accountId, period }).first();
    }

    /**
     * Returns all records with period below or equal of given period.
     * @param {Number} period The period to be searched
     * @returns {Promise<Array<AccountPeriod>>} Returns all records found
     */
    getByPeriod(period) {
        return db.accounts_period.where('period').belowOrEqual(period).toArray();
    }
}

db.accounts_period.mapToClass(AccountPeriod);

export default new AccountsPeriod();