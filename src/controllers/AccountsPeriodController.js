import AccountPeriod from '../models/AccountPeriod';
import accountsPeriod from '../db/AccountsPeriod';
import accounts from '../db/Accounts';
import GroupedAccounts from '../models/GroupedAccounts';
import AccountGroup from '../models/AccountGroup';
import accountsController from './AccountsController';

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

    /**
     * Returns accounts grouped by type with initial and final balance related to the given period
     * @param {Number} period Identification of the requested period
     * @returns {Promise<GroupedAccounts>} Returns the grouped accounts with balance related to the period
     */
    async getByPeriod(period) {
        if (!period)
            throw new TypeError('Period is required');
        
        const accounts = await accountsController.listAll();
        
        const promises = accounts.map(account => {
            let prom = accountsPeriod.getByIdPeriod(account.id, period).then(p => {
                if (!p) {
                    p = new AccountPeriod(account.id, period, 0);
                    p.initialBalance = account.initialValue;
                    p.balance = account.initialValue;
                }
                p.account = account;
                return p;
            });
            return prom;
        });
        
        const accPeriod = await Promise.all(promises);

        let groups = new GroupedAccounts(
            0, 
            0,
            new AccountGroup(0, 0, []), //checkings
            new AccountGroup(0, 0, []), //credit
            new AccountGroup(0, 0, [])  //savings
        );

        groups = accPeriod.reduce((group, accountPeriod) => {
            group[accountPeriod.account.type].items.push(accountPeriod);
            group[accountPeriod.account.type].initialSum += accountPeriod.initialValue;
            group[accountPeriod.account.type].sum += accountPeriod.initialValue + accountPeriod.balance;
            group.initialTotal += accountPeriod.initialValue;
            group.total += accountPeriod.initialValue + accountPeriod.balance;
            return group;
        }, groups);

        return groups;
    }

}

export default new AccountsPeriodController();