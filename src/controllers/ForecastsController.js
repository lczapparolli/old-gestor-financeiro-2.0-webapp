import forecasts from '../db/Forecasts';
import forecastsCategoriesController from './ForecastsCategoriesController';
import { isNumeric, convertToNumber } from '../helpers/ConvertToNumber';
import Forecast from '../models/Forecast';
import ForecastList from '../models/ForecastList';
import ForecastCategoryList from '../models/ForecastCategoryList';

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
        //TODO: Insert balance 0
        return forecast;
    }

    /**
     * Returns all forecasts and categories with totals
     * @returns {Promise<ForecastCategoryList>} List of categories and forecasts with totals
     */
    async findAll() {
        //Initializing object
        let result = new ForecastCategoryList();
        //Loading categories
        let categories = await forecastsCategoriesController.findAll();
        //Adding categories to result list
        result.categories = await Promise.all(
            categories.map(async c => {
                //Getting the list of forecasts
                const forecastList = await forecasts.getByCategory(c.id);
                //Building category
                let category = new ForecastList(
                    c.id,
                    c.name,
                    c.type,
                    forecastList
                );
                //Getting sum of forecasts values
                category.forecasts.forEach(forecast => {
                    category.total += forecast.amount;
                    category.totalBalance += forecast.balance;
                });
                //Adding to total
                result.total += category.total;
                result.totalBalance += category.totalBalance;
                return category;
            })
        );
        return result;
    }

    /**
     * Returns all forecasts without grouping
     * @returns {Promise<Array<Forecast>>} List of forecasts without grouping
     */
    listAll() {
        return forecasts.getAllForecasts();
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
     * @returns {Promise<Forecast>} The found forecast
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

    /**
     * Updates the balance of a given forecast, adding the `amount` to actual balance.
     * @param {Number} id The id of forecast to be updated
     * @param {*} amount The amount to be added to forecast balance
     */
    async updateBalance(id, amount) {
        const forecast = await this.getById(id);
        if (!forecast)
            throw new TypeError('Forecast must exists');
        if (amount === undefined || amount === null)
            throw new TypeError('Amount is required');
        const oldBalance = forecast.balance ? forecast.balance : 0;
        const newBalance = oldBalance + convertToNumber(amount);

        await forecasts.updateBalance(forecast.id, newBalance);
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
        const result = new Forecast(
            forecast.name,
            forecast.amount,
            (forecast.balance ? forecast.balance : 0),
            forecast.categoryId
        );

        if (forecast.id && forecast.id > 0) 
            result.id = forecast.id;
        return result;
    }
}

export default new ForecastsController();
