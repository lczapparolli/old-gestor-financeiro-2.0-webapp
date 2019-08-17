/**
 * @typedef {import('./ForecastList').default} ForecastCategoryTotal
 */

/**
 * A list of ForecastCategoryTotal with sum of amount and balance
 */
class ForecastCategoryList {
    /**
     * @type {Number} Sum of category total
     */
    total = 0;

    /**
     * @type {Number} Sum of category total balance
     */
    totalBalance = 0;

    /**
     * @type {Array<ForecastCategoryTotal>} List of categories
     */
    categories = [];
}

export default ForecastCategoryList;