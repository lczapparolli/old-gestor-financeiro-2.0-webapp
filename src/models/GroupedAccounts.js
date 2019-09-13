/**
 * An object grouping accounts in three categories with sum of values
 */
class GroupedAccounts {
    //Properties definition ---------------------------------------//
    /**
     * @type {Number} Sum of the balance of all accounts 
     */
    total = 0;

    /**
     * @type {Number} Sum of the initial value of all accounts
     */
    initialTotal = 0;

    /**
     * @type {AccountGroup} Accounts of type 'checking'
     */
    checking;

    /**
     * @type {AccountGroup} cc Accounts of type 'credit'
     */
    credit;

    /**
     * @type {AccountGroup} invest Accounts of type 'savings'
     */
    savings;

    //Constructor ---------------------------------------//
    /**
     * Create a new instance of grouped accounts
     * @typedef {Object} GroupedAccounts
     * @property {Number} total Sum of the balance of all accounts 
     * @property {Number} total Sum of the initial value of all accounts
     * @property {AccountGroup} checking Accounts of type 'checking'
     * @property {AccountGroup} credit Accounts of type 'credit'
     * @property {AccountGroup} savings Accounts of type 'savings'
     */
    constructor(total, initialTotal, checking, credit, savings) {
        this.total = total;
        this.initialTotal = initialTotal;
        this.checking = checking;
        this.credit = credit;
        this.savings = savings;
    }

}

export default GroupedAccounts;