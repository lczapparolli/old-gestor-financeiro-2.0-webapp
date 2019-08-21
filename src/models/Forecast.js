/**
 * Forecast model
 */
class Forecast {
    //Properties definition ---------------------------------------//

    /**
     * @type {Number} id Forecast id
     */
    id;
    
    /**
     * @type {String} Forecast name
     */
    name = '';
    
    /**
     * @type {Number} Forecast value
     */
    amount = 0;
    
    /**
     * @type {Number} Sum of movements values with this forecast
     */
    balance = 0;
    
    
    /**
     * @type {Number} Id of corresponding category
     */
    categoryId;

    //Constructor ---------------------------------------//
    /**
     * Creates a new Forecast object. This constructor does not store the object into database.
     * @param {String} name Forecast name
     * @param {Number} amount Forecast amount
     * @param {Number} balance Sum of movements values with this forecast
     * @param {Number} categoryId Id of corresponding category
     */
    constructor(name, amount, balance, categoryId) {
        this.name = name;
        this.amount = amount;
        this.balance = balance;
        this.categoryId = categoryId;
    }
}

export default Forecast;