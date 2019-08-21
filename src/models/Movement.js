
/**
 * @typedef {import('./Forecast').default} Forecast
 * @typedef {import('./Account').default} Account
 */

/**
 * Movement model
 */
class Movement {
    //Properties definition ---------------------------------------//

    /**
     * @type {Number} Movement id
     */
    id;

    /**
     * @type {Number} Account id
     */
    accountId;

    /**
     * @type {Account} Account related to movement
     */
    account;

    /**
     * @type {Number} Forecast id
     */
    forecastId;

    /**
     * @type {Forecast} Forecast related to movement
     */
    forecast;

    /**
     * @type {String} Movement description
     */
    description = '';

    /**
     * @type {Number} Movement amount
     */
    value = 0;

    /**
     * @type {Date} Movement date
     */
    date;

    //Constructor ---------------------------------------//

    /**
     * Creates a new instace. This constructor does not save to database
     * @param {Number} accountId Account id
     * @param {Number} forecastId Forecast id
     * @param {String} description Movement description
     * @param {Number} value Movement amount
     * @param {Date} date Movement date
     */
    constructor(accountId, forecastId, description, value, date) {
        this.accountId = accountId;
        this.forecastId = forecastId;
        this.description = description;
        this.value = value;
        this.date = date;
    }
}

export default Movement;