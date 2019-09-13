/**
 * A group of accounts
 */
class AccountGroup {
    //Properties definition ---------------------------------------//
    /**
     * @type {Number} Sum of the balance of all accounts in the group
     */
    sum = 0;

    /**
     * @type {Number} Sum of the initial value of all accounts in the group
     */
    initialSum = 0;

    /**
     * @type {Array<Account>} List of accounts in the group
     */
    items = [];

    //Constructor ---------------------------------------//
    /**
     * Creates a new instance of AccountGroup
     * @param {Number} sum Sum of the balance of all accounts in the group
     * @param {Number} sum Sum of the initial value of all accounts in the group
     * @param {Array<Account>} items List of accounts in the group
     */
    constructor(sum, initialSum, items) {
        this.sum = sum;
        this.initialSum = initialSum;
        this.items = items;
    }
}

export default AccountGroup;