//Categories types
const INCOME = 'incomes';
const PREDICTED = 'predicted';
const UNPREDICTED = 'unpredicted';

const CATEGORY_TYPES = [INCOME, PREDICTED, UNPREDICTED];

/**
 * Forecast category model
 */
class ForecastCategory {
    //Properties definition ---------------------------------------//
    /**
     * @type {Number} Category id
     */
    id;

    /**
     * @type {String} Category name
     */
    name = '';

    /**
     * @type {String} Category type. Must be one of `CATEGORY_TYPES`
     */
    type = '';

    //Constructor ---------------------------------------//
    /**
     * Creates a new ForecastCategory. This constructor does not store the object into database.
     * @param {String} name Category name
     * @param {String} type The type of the category. Must be one of `CATEGORY_TYPES`
     */
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

export default ForecastCategory;
export { CATEGORY_TYPES, INCOME, PREDICTED, UNPREDICTED };