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
     * @type {Array<Account>} List of accounts in the group
     */
    items = [];

    //Constructor ---------------------------------------//
    /**
     * Creates a new instance of AccountGroup
     * @param {Number} sum Sum of the balance of all accounts in the group
     * @param {Array<Account>} items List of accounts in the group
     */
    constructor(sum, items) {
        this.sum = sum;
        this.items = items;
    }
}

export default AccountGroup;