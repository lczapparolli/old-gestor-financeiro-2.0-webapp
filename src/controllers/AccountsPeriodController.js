import accountsPeriod from '../db/AccountsPeriod';
import accounts from '../db/Accounts';
import AccountPeriod from '../models/AccountPeriod';
import GroupedAccounts from '../models/GroupedAccounts';
import AccountGroup from '../models/AccountGroup';
import accountsController from './AccountsController';
import { isNumeric, convertToNumber } from '../helpers/ConvertToNumber';

//Symbols
const validateAccountPeriod = Symbol('validateAccountPeriod');
const validateAccountId = Symbol('validateAccountId');
const validateNumber = Symbol('validateNumber');
const extractFields = Symbol('extractFields');

class AccountsPeriodController {

    /**
     * Inserts or updates an AccuntPeriod object into the database
     * @param {AccountPeriod} accountPeriod The object to be inserted or updated
     * @returns {Promise<AccountPeriod>} Returns a new object with the id
     * @throws {TypeError} Throws a TyperError if the object is invalid
     */
    async saveAccountPeriod(accountPeriod) {
        const validationMessage = await this[validateAccountPeriod](accountPeriod);
        if (validationMessage !== '')
            throw new TypeError(validationMessage);

        const newAccountPeriod = this[extractFields](accountPeriod);
        newAccountPeriod.id = await accountsPeriod.saveAccountPeriod(newAccountPeriod);

        return newAccountPeriod;
    }

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


    //Private methods ---------------------------------------//

    /**
     * Validates an accountPeriod object before it is saved into database.
     * Returning the validation message
     * @param {AccountPeriod} accountPeriod Object to be validated
     * @returns {String} Returns the validation message or empty if it is valid
     */
    async [validateAccountPeriod](accountPeriod) {
        if (!accountPeriod) 
            return 'AccountPeriod is required';

        let result = await this[validateAccountId](accountPeriod.accountId);
        if (result !== '')
            return result;

        result = this[validateNumber](accountPeriod.period);
        if (result !== '')
            return 'Period ' + result;

        result = this[validateNumber](accountPeriod.balance);
        if (result !== '')
            return 'Balance ' + result;

        return '';
    }

    /**
     * Validates if the accountId is valid and if the correspondent object existis in the database.
     * Return the validation message.
     * @param {Number} accountId The accountId to be validated
     * @returns {String} Returns the validation message or empty if it is valid
     */
    async [validateAccountId](accountId) {
        if (!accountId) 
            return 'Account id is required';
        if (!isNumeric(accountId))
            return 'Account id must be a number';
        
        const account = await accountsController.getById(accountId);
        if (!account)
            return 'Account must exists';

        return '';
    }

    /**
     * Validates if a number is present and if it is a valid number or numeric string.
     * Returns the validation message
     * @param {Number} number The number to be validated
     * @returns {String} Returns the validation message or empty if it is valid
     */
    [validateNumber](number) {
        if (number == null || number == undefined || number === '')
            return 'is required';
        if (!isNumeric(number))
            return 'must be a number';
        
        return '';
    }

    /**
     * Extract only the needed fields from the model
     * @param {AccountPeriod} accountPeriod The original object
     * @returns {AccountPeriod} The new object created
     */
    [extractFields](accountPeriod) {
        let result = new AccountPeriod(
            convertToNumber(accountPeriod.accountId),
            convertToNumber(accountPeriod.period),
            convertToNumber(accountPeriod.balance)
        );

        if (accountPeriod.id)
            result.id = accountPeriod.id;

        return result;
    }

}

export default new AccountsPeriodController();