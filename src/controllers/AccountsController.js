import accounts from '../db/Accounts';
import { isNumeric, convertToNumber } from '../helpers/ConvertToNumber';
/**
 * An account object
 * @typedef {Object} Account
 * @property {Number} id - Account id
 * @property {String} name - Account name (Required for insert)
 * @property {Number} balance - Account balance
 * @property {String} type - Account type (Required for insert)
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
const extractFields = Symbol('extractFields');

//Accounts types
const CHECKING = 'checking';
const CREDIT = 'credit';
const SAVINGS = 'savings';
const ACCOUNT_TYPES = [CHECKING, CREDIT, SAVINGS];

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
            total: 0
        };
        for (let type of ACCOUNT_TYPES)
            groups[type] = { items: [], sum: 0 };
    
        groups = accountList.reduce((group, account) => {
            group[account.type].items.push(account);
            group[account.type].sum += account.balance;
            group.total += account.balance;
            return group;
        }, groups);

        return groups;
    }

    /**
     * Loads all accounts from database without grouping
     * @returns {Promise<Array<Account>>} List of accounts
     */
    listAll() {
        return accounts.getAllAccounts();
    }

    /**
     * Inserts a new account. The method resolves when the account is inserted and is rejected when an error occours
     * @param {Account} account - The new account to be inserted
     * @returns {Promise<Account>} - The saved account with current id
     */
    async saveAccount(account) {
        const validationMessage = await this[validateAccount](account);
        if (validationMessage !== '')
            throw validationMessage;
        account = this[extractFields](account);
        account.id = await accounts.addAccount(account);
        return account;
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

    /**
     * Updates the balance of a given account, adding the `amount` to actual balance.
     * @param {Number} id The id of account to be updated
     * @param {*} amount The amount to be added to account balance
     */
    async updateBalance(id, amount) {
        const account = await this.getById(id);
        if (!account)
            throw new TypeError('Account must exists');
        if (amount == undefined || amount == null)
            throw new TypeError('Amount is required');
        account.balance += convertToNumber(amount);

        await this.saveAccount(account);
    }

    //Private methods ---------------------------------------//
    
    /**
     * Validates if the account object can be stored
     * @param {Account} account - Account object to be validated
     * @returns {String} - Validation message
     */
    async [validateAccount](account) {
        let message = '';
        if (!account) {
            message = 'Account is required';
        } else if (!account.name || account.name.trim() === '') {
            message = 'Account name is required';
        } else if (!account.type) {
            message = 'Account type is required';
        } else if (!ACCOUNT_TYPES.some(type => type === account.type)) {
            message = 'Invalid account type';
        } else if (!account.id || account.id === 0) {
            const savedAccount = await this.getByName(account.name);
            if (savedAccount && savedAccount.id !== account.id)
                message = 'Account already exists';
        }
        return message;
    }

    /**
     * Creates a new account object with only needed fields
     * @param {Account} account - Account object to be stored
     * @returns {Account} - Account object without extra fields
     */
    [extractFields](account) {
        const result = { 
            name: account.name,
            type: account.type,
            balance: account.balance || 0
        };
        if (account.id && account.id > 0)
            result.id = account.id;
        return result;
    }
}

export default new AccountsController();
export { CHECKING, CREDIT, SAVINGS, ACCOUNT_TYPES };