
/**
 * @typedef {import('./Account').default} Account
 */

/**
 * Contains the initial and final balance of an account in a given period
 */
class AccountPeriodGroup {
    //Properties definition ---------------------------------------//
    /**
     * @type {Account} The account object
     */
    account = null;

    /**
     * @type {Number} The initial balance in the period
     */
    initialBalance = 0;

    /**
     * @type {Number} The final balance in the period
     */
    periodBalance = 0;

    //Constructor ---------------------------------------//
    /**
     * Creates a new instance of AccountPeriodGroup
     * @param {Account} account The account object
     * @param {Number} initialBalance The initial balance in the period
     * @param {Number} periodBalance The final balance in the period
     */
    constructor(account, initialBalance, periodBalance) {
        this.account = account;
        this.initialBalance = initialBalance;
        this.periodBalance = periodBalance;
    }

}

export default AccountPeriodGroup;