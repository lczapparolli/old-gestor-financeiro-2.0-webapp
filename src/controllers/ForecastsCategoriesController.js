import forecastsCategories from '../db/ForecastsCategories';

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
     * Insert or updates a category
     * @param {ForecastCategory} category - Category data to be persisted
     * @returns {ForecastCategory} The category object with corresponding id
     */
    async saveCategory(category) {
        const validationMessage = this[validateCategory](category);
        if (validationMessage !== '')
            throw validationMessage;
        else {
            category = this[extractFields](category);
            if (!category.id || category.id === 0) //if is a new category, type will be 'predicted'
                category.type = PREDICTED;
            category.id = await forecastsCategories.addCategory(category);
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
        return {
            id: category.id, 
            name: category.name, 
            type: category.type
        };
    }
}

export default new ForecastsCategoriesController();
export { CATEGORY_TYPES, INCOME, PREDICTED, UNPREDICTED };