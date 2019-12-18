/**
 * @typedef {import('./Account').default} Account
 */

/**
 * Account data related to a period
 */
class AccountPeriod {

    /**
     * @type {Number} AccountPeriod id
     */
    id;

    /**
     * @type {Number} Account id
     */
    accountId;

    /**
     * @type {Account} Account object related
     */
    account;

    /**
     * @type {Numeric} Period related
     */
    period;

    /**
     * @type {Number} Initial balance, equals to balance of previous period
     */
    initialBalance;

    /**
     * @type {Number} Final balance, summing all movements in period
     */
    balance;

    /**
     * Creates a new instance of an AccountPeriod object
     * @param {Number} accountId Related account id
     * @param {Number} period Related period 
     * @param {Number} initialBalance Initial balance in period 
     */
    constructor(accountId, period, initialBalance) {
        this.accountId = accountId;
        this.period = period;
        this.initialBalance = initialBalance;
    }
}

export default AccountPeriod;