import accounts from '../db/Accounts';
import { isNumeric, convertToNumber } from '../helpers/ConvertToNumber';
/**
 * An account object
 * @typedef {Object} Account
 * @property {String} name - Account name
 * @property {Number} balance - Account balance
 * @property {String} type - Account type
 * 
 * A group of accounts
 * @typedef {Object} AccountGroup
 * @property {Number} sum - Sum of the balance of all accounts in the group
 * @property {Account[]} items - List of accounts in the group
 * 
 * An object grouping accounts in three categories with sum of values
 * @typedef {Object} GroupedAccounts
 * @property {Number} total - Sum of the balance of all accounts 
 * @property {AccountGroup} account - Accounts of type 'account'
 * @property {AccountGroup} cc - Accounts of type 'credit card'
 * @property {AccountGroup} invest - Accounts of type 'investment'
 */

//Symbols
const validateAccount = Symbol('validateAccount');

//Accounts types
const ACCOUNT = 'account';
const CREDIT_CARD = 'cc';
const INVESTMENT = 'invest';
const ACCOUNT_TYPES = [ACCOUNT, CREDIT_CARD, INVESTMENT];

/**
 * Controls the account data
 */
class AccountsController {

    /**
     * Loads all accounts and groups items accordly the type and sums the balances.
     * @returns {Promise<GroupedAccounts>} Returns a promise that resolves with 
     */
    async findAll() {
        const accountList = await accounts.getAllAccounts();
    
        let groups = {
            total: 0,
            account: { items: [], sum: 0 },
            cc: { items: [], sum: 0 },
            invest: { items: [], sum: 0 }
        };
    
        groups = accountList.reduce((group, account) => {
            group[account.type].items.push(account);
            group[account.type].sum += account.balance;
            group.total += account.balance;
            return group;
        }, groups);

        return groups;
    }

    /**
     * Inserts a new account. The method resolves when the account is inserted and is rejected when an error occours
     * @param {Account} account - The new account to be inserted
     * @returns {Promise}
     */
    async saveAccount(account) {
        const validationMessage = this[validateAccount](account);
        if (validationMessage !== '')
            throw validationMessage;
        else
            return await accounts.addAccount(account);
    }

    /**
     * Finds an account by the name
     * @param {String} name - Account name to be searched 
     * @returns {Promise<Account>} If account is found the promise resolves with it otherwise resolves with null
     */
    async getByName(name) {
        if (!name)
            throw new TypeError('Account name is required');
        const result = await accounts.getByName(name);
        if (result.length === 0)
            return null;
        else if (result.length === 1)
            return result[0];
        else 
            throw new Error('Duplicated account name found');
    }

    /**
     * Gets an account by its primary key
     * @param {Number} id - Account primary key 
     * @returns {Promise<Account>} If account is found the promise resolves with it otherwise resolves with null
     */
    async getById(id) {
        if (!id)
            throw new TypeError('Id is required');
        id = id.toString();
        if (!isNumeric(id))
            throw new TypeError('Id must be numeric');
        const result = await accounts.getById(convertToNumber(id));
        if (result)
            return result;
        else //Standartizing return
            return null;
    }
    //Private methods ---------------------------------------//
    /**
     * Validates if the account object can be stored
     * @param {Account} account - Account object to be validated
     * @returns {String} - Validation message
     */
    [validateAccount](account) {
        let message = '';
        if (!account) {
            message = 'Account is required';
        } else if (!account.name || account.name.trim() === '') {
            message = 'Account name is required';
        } else if (!account.type) {
            message = 'Account type is required';
        } else if (!ACCOUNT_TYPES.some(type => type === account.type)) {
            message = 'Invalid account type';
        }
        return message;
    }
}

export default new AccountsController();
export { ACCOUNT, CREDIT_CARD, INVESTMENT, ACCOUNT_TYPES };