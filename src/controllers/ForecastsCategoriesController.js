import forecastsCategories from '../db/ForecastsCategories';
import { isNumeric, convertToNumber } from '../helpers/ConvertToNumber';

/**
 * Category object
 * @typedef {Object} ForecastCategory
 * @property {Number} id - Category id
 * @property {String} name - Category name (Required for insert)
 * @property {String} type - Category type
 */

//Symbols
const validateCategory = Symbol('validateCategory');
const extractFields = Symbol('extractFields');

//Category types
const INCOME = 'incomes';
const PREDICTED = 'predicted';
const UNPREDICTED = 'unpredicted';
const CATEGORY_TYPES = [INCOME, PREDICTED, UNPREDICTED];

/**
 * Controls the forecasts categories data
 */
class ForecastsCategoriesController {

    /**
     * Returns all forecasts categories
     * @returns {Promise<ForecastCategory[]} All categories
     */
    findAll() {
        return forecastsCategories.getAllCategories();
    }

    /**
     * Finds a category by its id
     * @param {Numeric} id - Category id
     * @returns {Promise<ForecastCategory} The found category
     */
    async getById(id) {
        if (!id)
            throw new TypeError('Id is required');
        id = id.toString();
        if (!isNumeric(id))
            throw new TypeError('Id must be numeric');
        const result = await forecastsCategories.getById(convertToNumber(id));
        if (result)
            return result;
        else //Standartizing return
            return null;
    }

    /**
     * Insert or updates a category
     * @param {ForecastCategory} category - Category data to be persisted
     * @returns {Promise<ForecastCategory>} The category object with corresponding id
     */
    async saveCategory(category) {
        const validationMessage = this[validateCategory](category);
        if (validationMessage !== '')
            throw validationMessage;
        else {
            category = this[extractFields](category);
            if (!category.id || category.id === 0) {
                category.type = PREDICTED; //if is a new category, type will be 'predicted'
                category.id = await forecastsCategories.addCategory(category);
            } else {
                //Updates only category name
                await forecastsCategories.updateCategoryName(category.id, category.name);
            }
            return category;
        }
    }

    //Private methods ---------------------------------------//

    /**
     * Validates if the objects can be persisted
     * @param {ForecastCategory} category - Category object to be validated 
     * @returns {String} Returns an empty string if object is valid, or the error message
     */
    [validateCategory](category) {
        let message = '';
        if (!category) 
            message = 'Category is required';
        else if (!category.name || category.name.trim() === '')
            message = 'Category name is required';
        return message;
    }

    /**
     * Extract only the necessary fiels, in case of extra data is added to object
     * @param {ForecastCategory} category - Object of which information will be extracted
     * @returns {ForecastCategory} Category object without any extra data
     */
    [extractFields](category) {
        let result = {
            name: category.name, 
            type: category.type
        };

        if (category.id && category.id > 0)
            result.id = category.id;

        return result;
    }
}

export default new ForecastsCategoriesController();
export { CATEGORY_TYPES, INCOME, PREDICTED, UNPREDICTED };