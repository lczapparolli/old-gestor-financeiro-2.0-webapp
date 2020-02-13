import db from './index';
import AccountPeriod from '../models/AccountPeriod';

class AccountsPeriod {

    /**
     * Returns an account with balance relative to a period
     * @param {Number} accountId The id of the account
     * @param {Number} period The period of the balance
     * @returns {Promise<AccountPeriod>}
     */
    getByIdPeriod(accountId, period) {
        return db.accounts_periods.where('[accountId+period]').equals([accountId, period]).first();
    }
}

db.accounts.mapToClass(AccountPeriod);

export default new AccountsPeriod();