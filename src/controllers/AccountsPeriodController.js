import AccountPeriod from '../models/AccountPeriod';
import accountsPeriod from '../db/AccountsPeriod';
import accounts from '../db/Accounts';

class AccountsPeriodController {

    /**
     * Returns the initial and final balance related to the period
     * @param {Number} accountId Id of the required account
     * @param {Number} period Indentification of the required period
     * @returns {Promise<AccountPeriod>} Returns the account data and balance related to the period
     */
    async getByIdPeriod(accountId, period) {
        if (!accountId)
            throw new TypeError('Id is required');
        if (!period)
            throw new TypeError('Period is required');

        let result = await accountsPeriod.getByIdPeriod(accountId, period);
        if (!result) {
            result = new AccountPeriod(accountId, period, 0);
            result.account = await accounts.getById(accountId);
            result.initialBalance = result.account.initialValue;
            result.balance = result.account.initialValue;
        }

        return result;
    }

}

export default new AccountsPeriodController();