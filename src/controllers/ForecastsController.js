import forecasts from '../db/Forecasts';
import forecastsCategoriesController from './ForecastsCategoriesController';
import { isNumeric, convertToNumber } from '../helpers/ConvertToNumber';

/**
 * Forecast object
 * @typedef {Object} Forecast
 * @property {Number} id - Forecast id
 * @property {String} name - Forecast name (Required for insert)
 * @property {Number} amount - Forecast amount (Required for insert)
 * @property {Number} categoryId - Id of corresponding category (Required for insert)
 * 
 * Import from ForecastCategory
 * @typedef {import('./ForecastsCategoriesController').ForecastCategory} ForecastCategory
 * 
 * Category with list of forecasts and total
 * @typedef {Object} CategoryList
 * @property {Forecast[]} forecasts - List of forecasts of this category
 * @property {Number} total - Sum of forecasts amount
 * 
 * Category object
 * @typedef {ForecastCategory & CategoryList} Category
 * 
 * Forecast list object
 * @typedef {Object} ForecastList
 * @property {Category[]} categories - List of forecasts categories
 * @property {Number} total - Sum of forecasts amount
 */


//Symbols
const validateForecast = Symbol('validateForecast');
const checkExistentCategory = Symbol('checkExistentCategory');
const extractField = Symbol('extractField');

class ForecastsController {

    /**
     * Adds or updates a forecast into database. If `id` field is filled, forecast with corresponding key will be updated.
     * @param {Forecast} forecast - Forecast object to be persisted to database (Added or updated)
     * @returns {Promise<Forecast>} - Returns the saved forecast with current id
     * @throws {TypeError} Throws an error with a validation message if Forecast fields are not valid
     */
    async saveForecast(forecast) {
        const validationMessage = await this[validateForecast](forecast);
        if (validationMessage !== '')
            throw new TypeError(validationMessage);
        forecast = this[extractField](forecast);
        forecast.id = await forecasts.addForecast(forecast);
        //TODO: Update only `name` and `amount` fields
        return forecast;
    }

    /**
     * Returns all forecasts and categories with totals
     * @returns {Promise<ForecastList>} List of categories and forecasts with totals
     */
    async findAll() {
        //Initializing object
        let result = { total: 0 };
        //Loading categories
        result.categories = await forecastsCategoriesController.findAll();
        await Promise.all(
            result.categories.map(async category => {
                //Loading forecasts
                category.forecasts = await forecasts.getByCategory(category.id);
                //Getting sum of forecasts amount
                category.total = category.forecasts.reduce((total, forecast) => total + forecast.amount, 0);
                //Adding to total
                result.total += category.total;
            })
        );
        return result;
    }

    /**
     * Finds a forecast by its name.
     * @param {String} name - Forecast name to be searched
     * @returns {Promise<Forecast>} Returns the forecast corresponding or null if no forecast is found
     * @throws {TypeError} Throws an error if forecast name is not provided
     * @throws {Error} Throws an error if more than one forecast is found
     */
    async getByName(forecastName) {
        if (!forecastName || forecastName.toString().trim() === '')
            throw new TypeError('Forecast name is required');
        const result = await forecasts.getByName(forecastName);
        if (result.length === 0)
            return null;
        else if (result.length === 1)
            return result[0];
        else
            throw new Error('Duplicated forecast found');
    }

    /**
     * Finds a forecast by its id
     * @param {Numeric} id - Forecast id
     * @returns {Promise<Forecast} The found forecast
     */
    async getById(forecastId) {
        if (!forecastId)
            throw new TypeError('Id is required');
        forecastId = forecastId.toString();
        if (!isNumeric(forecastId))
            throw new TypeError('Id must be numeric');
        const result = await forecasts.getById(convertToNumber(forecastId));
        if (result)
            return result;
        else //Standartizing return
            return null;
    }

    //Private methods ---------------------------------------//
    
    /**
     * Validates a Forecast to be saved to database
     * @param {Forecast} forecast - Forecast object to be validated
     * @returns {Promise<String>} Returns the error message, or an empty string if object is valid
     */
    async [validateForecast](forecast) {
        if (!forecast)
            return 'Forecast is required';
        if (!forecast.name || forecast.name.toString().trim() === '')
            return 'Forecast name is required';
        if (typeof forecast.name !== 'string')
            return 'Forecast name must be a string';
        if (!forecast.amount && forecast.amount !== 0)
            return 'Forecast amount is required';
        if (typeof forecast.amount !== 'number')
            return 'Forecast amount must be a number';
        if (!forecast.categoryId)
            return 'Category id is required';
        if (typeof forecast.categoryId !== 'number')
            return 'Category id must be a number';
        if (!await this[checkExistentCategory](forecast.categoryId))
            return 'Category must exists';
        return '';
    }

    /**
     * Checks if category exists
     * @param {Number} categoryId Id of category to be searched
     * @returns {Promise<Boolean>} Returns `true` if category exists, `false` otherwise
     */
    async [checkExistentCategory](categoryId) {
        const forecastCategory = await forecastsCategoriesController.getById(categoryId);
        return !!forecastCategory;
    }

    /**
     * Extract only the necessary fields from parameter
     * @param {Forecast} forecast Original object to be cleaned
     * @returns {Forecast} Return a forecast object without extra properties
     */
    [extractField](forecast) {
        const result = {
            name: forecast.name,
            amount: forecast.amount,
            categoryId: forecast.categoryId
        };
        if (forecast.id && forecast.id > 0)
            result.id = forecast.id;
        return result;
    }
}

export default new ForecastsController();
