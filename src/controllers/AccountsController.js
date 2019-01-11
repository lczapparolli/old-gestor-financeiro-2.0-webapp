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
    findAll() {
        const accounts = [
        ];
    
        let groups = {
            total: 0,
            account: { items: [], sum: 0 },
            cc: { items: [], sum: 0 },
            invest: { items: [], sum: 0 }
        };
    
        groups = accounts.reduce((group, account) => {
            group[account.type].items.push(account);
            group[account.type].sum += account.balance;
            group.total += account.balance;
            return group;
        }, groups);

        return Promise.resolve(groups);
    }

    /**
     * Inserts a new account. The method resolves when the account is inserted and is rejected when an error occours
     * @param {Account} account - The new account to be inserted
     */
    addAccount(account) {
        const promise = new Promise((resolve, reject)=> {
            const validationMessage = this[validateAccount](account);
            if (validationMessage !== '')
                reject(validationMessage);
        });
        return promise;
    }

    //Private methods ---------------------------------------//
    /**
     * Validates if the account object can be stored
     * @param {Account} account - Account object to be validated
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
export { ACCOUNT, CREDIT_CARD, INVESTMENT };