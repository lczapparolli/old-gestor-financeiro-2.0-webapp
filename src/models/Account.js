//Accounts types
const CHECKING = 'checking';
const CREDIT = 'credit';
const SAVINGS = 'savings';

const ACCOUNT_TYPES = [CHECKING, CREDIT, SAVINGS];

/**
 * Account model
 */
class Account {
    //Properties definition ---------------------------------------//
    
    /**
     * @type {Number} Account id
     */
    id;
    
    /**
     * @type {String} Account name
     */
    name = '';

    /**
     * @type {String} Account type. Must be one of `ACCOUNT_TYPES`.
     */
    type = '';
    
    /**
     * @type {Number} Account balance
     */
    balance = 0;

    //Constructor ---------------------------------------//
    /**
     * Creates a new Account object. This constructor does not store the object into database.
     * @param {String} name Account name
     * @param {String} type The type of the account. Must be one of `ACCOUNT_TYPES`.
     * @param {Number} balance The account balance
     */
    constructor(name, type, balance) {
        this.name = name;
        this.type = type;
        this.balance = balance;
    }
}

export default Account;
export { CHECKING, CREDIT, SAVINGS, ACCOUNT_TYPES };