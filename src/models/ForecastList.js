import ForecastCategory from './ForecastCategory';

/**
 * @typedef {import('./Forecast').default} Forecast
 */

/**
 * A forecast category with the list of forecasts and sum of amount and balance
 * @extends {ForecastCategory}
 */
class ForecastList extends ForecastCategory {
    /**
     * @type {Array<Forecast>} List of forecasts with this category
     */
    forecasts = [];

    /**
     * @type {Number} Sum of forecasts amount
     */
    total = 0;

    /**
     * @type {Number} Sum of forecasts balance
     */
    totalBalance = 0;

    /**
     * Creates a new instance of ForecastCategoryTotal
     * @param {Number} id Forecast category id 
     * @param {String} name Forecast category name
     * @param {String} type Forecast category type
     * @param {Array<Forecast>} forecasts List of forecasts with this category
     */
    constructor(id, name, type, forecasts) {
        super(name, type);
        this.id = id;
        this.forecasts = forecasts;
    }
}

export default ForecastList;