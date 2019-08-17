
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
    id = undefined;

    /**
     * @type {Number} Account id
     */
    accountId = undefined;

    /**
     * @type {Account} Account related to movement
     */
    account = undefined;

    /**
     * @type {Number} Forecast id
     */
    forecastId = undefined;

    /**
     * @type {Forecast} Forecast related to movement
     */
    forecast = undefined;

    /**
     * @type {String} Movement description
     */
    description = undefined;

    /**
     * @type {Number} Movement amount
     */
    value = undefined;

    /**
     * @type {Date} Movement date
     */
    date = undefined;

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