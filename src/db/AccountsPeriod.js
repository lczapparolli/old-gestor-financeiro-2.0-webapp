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
     * Returns an account with balance relative to a period
     * @param {Number} accountId The id of the account
     * @param {Number} period The period of the balance
     * @returns {Promise<AccountPeriod>}
     */
    getByPeriod(accountId, period) {
        return db.accounts_period
            .where('accountId').equals(accountId)
            .and((accountPeriod) => accountPeriod.period <= period)
            .first();
    }
}

db.accounts_period.mapToClass(AccountPeriod);

export default new AccountsPeriod();