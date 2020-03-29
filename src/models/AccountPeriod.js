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
     * @type {Number} Period balance, summing all movements in period
     */
    balance;

    /**
     * Creates a new instance of an AccountPeriod object
     * @param {Number} accountId Related account id
     * @param {Number} period Related period 
     * @param {Number} balance Balance in the period
     */
    constructor(accountId, period, balance) {
        this.accountId = accountId;
        this.period = period;
        this.balance = balance;
    }
}

export default AccountPeriod;