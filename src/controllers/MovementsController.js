import movements from '../db/Movements';
import accounts from '../db/Accounts';
import forecasts from '../db/Forecasts';
import accountsController from './AccountsController';
import forecastsController from './ForecastsController';
import { isNumeric, convertToNumber } from '../helpers/ConvertToNumber';
import { isDate, convertToDate } from '../helpers/ConvertToDate';

/**
 * Movement object
 * @typedef {Object} Movement
 * @property {Number} id Movement id
 * @property {Number} accountId Id of corresponding account (Required)
 * @property {Number} forecastId Id of corresponding forecast (Required)
 * @property {Number} value Value of movement (Require)
 * @property {String} description Movement description and aditiona info
 * @property {Date} date Movement date (Required)
 * @property {import('./AccountsController').Account} account Account related to movement
 * @property {import('./ForecastsController').Forecast} forecast Forecast related to movement
 */

//Symbols
const validateMovement = Symbol('validateMovement');
const validateAccountId = Symbol('validateAccountId');
const validateForecastId = Symbol('validateForecastId');
const validateValue = Symbol('validateValue');
const validateDate = Symbol('validateDate');
const extractFields = Symbol('extractFields');
const validateId = Symbol('validateId');

/**
 * Class to control movement data, it can save and gets movements
 */
class MovementsController {

    /**
     * Adds or updates a movement into database
     * @param {Movement} movement Movement object to be persisted to database 
     * @returns {Promise<Movement>} Returns the inserted object with current `id`
     * @throws {TypeError} Throws an error if fields are not valid
     */
    async saveMovement(movement) {
        const validationMessage = await this[validateMovement](movement);
        if(validationMessage !== '')
            throw new TypeError(validationMessage);
        movement = this[extractFields](movement);
        movement.id = await movements.addMovement(movement);
        return movement;
    }

    /**
     * Load all movements
     * @returns {Promise<Array<Movement>>} Returns an array with all movements
     */
    async findAll() {
        //TODO: Improve performance
        let movementList = await movements.getAllMovements();

        movementList = await Promise.all(movementList.map(async movement => {
            movement.account = await accounts.getById(movement.accountId);
            movement.forecast = await forecasts.getById(movement.forecastId);
            return movement;
        }));

        return movementList;
    }

    /**
     * Finds a movement by its Id
     * @param {Number} movementId Identification of movement to be found
     * @returns {Promise<Movement>} Returns the movement found
     * @throws {TypeError} Throws an error when the parameter has an invalid value
     */
    async getById(movementId) {
        const validationMessage = this[validateId](movementId);
        if (validationMessage !== '')
            throw new TypeError('Id ' + validationMessage);
        
        const movement = await movements.getById(convertToNumber(movementId));
        
        if (movement)
            return movement;
        else
            return null;
    }

    /**
     * Deletes a movement from database
     * @param {String|Number} movementId The movement to be deleted
     * @throws {TypeError}
     */
    async deleteMovement(movementId) {
        const validationMessage = this[validateId](movementId);
        if (validationMessage !== '')
            throw new TypeError('Id ' + validationMessage);
        await movements.deleteMovement(movementId);
    }

    //Private methods ---------------------------------------//

    /**
     * Validates the object fields, returning an error message
     * @param {Movement} movement The object to be validated
     * @returns {Promise<String>} Returns the error message, or an empty string if the object is valid
     */
    async [validateMovement](movement) {
        if (!movement)
            return 'Movement is required';
        let result = await this[validateAccountId](movement.accountId);
        if (result !== '')
            return result;
        result = await this[validateForecastId](movement.forecastId);
        if (result !== '')
            return result;
        result = this[validateValue](movement.value);
        if (result !== '')
            return result;
        result = this[validateDate](movement.date);
        if (result !== '')
            return result;
        return '';
    }

    /**
     * Validates the account id. Checks if it is a valid number and if account exists
     * @param {Number} accountId The id to be validated
     * @returns {Promise<String>} Returns the error message or empty if id is valid
     */
    async [validateAccountId](accountId) {
        const validationMessage = this[validateId](accountId);
        if (validationMessage !== '')
            return 'Account id ' + validationMessage;
        
        const account = await accountsController.getById(accountId);
        if (!account)
            return 'Account must exists';
        return '';
    }

    /**
     * Validates de forecast id. Checks if it is a valid number and if forecast exists
     * @param {Number} forecastId The id to be validated
     * @returns {Promise<String>} Returns the error message or empty if id is valid
     */
    async [validateForecastId](forecastId) {
        const validationMessage = this[validateId](forecastId);
        if (validationMessage !== '')
            return 'Forecast id ' + validationMessage;
        
        const forecast = await forecastsController.getById(forecastId);
        if (!forecast)
            return 'Forecast must exists';
        return '';
    }

    /**
     * Validates the movement value. Checks if it is a number or a numeric string
     * @param {Number} value The value to be validated
     * @returns {String} Returns the error message or empty if value is valid
     */
    [validateValue](value) {
        if (!value)
            return 'Value is required';
        if (!isNumeric(value))
            return 'Value must be a number';
        return '';
    }

    /**
     * Validates de movement date. Check if it is a Date object, a number or a date string.
     * @param {Date|Number|String} date The date to be validated
     * @returns {String} Returns the error message or empty if value is valid
     */
    [validateDate](date) {
        if (!date)
            return 'Date is required';
        if (!isDate(date))
            return 'Date must be a valid date';
        return '';
    }

    /**
     * Extract only the needed fields from the object and grants the correct object types
     * @param {Object|Movement} movement The source object
     * @returns {Movement} Returns the formated object as expected
     */
    [extractFields](movement) {
        let result = {
            accountId: convertToNumber(movement.accountId),
            forecastId: convertToNumber(movement.forecastId),
            description: movement.description,
            value: convertToNumber(movement.value),
            date: convertToDate(movement.date)
        };
        if(movement.id && movement.id > 0)
            result.id = movement.id;
        return result;
    }

    /**
     * Checks if an Id is not null and if it is a numeric string
     * @param {Number|String} id Id field to be validated
     * @returns {String} Returns the error message or empty if id is valid
     */
    [validateId](id) {
        if (!id)
            return 'is required';
        if (!isNumeric(id)) 
            return 'must be a number';
        
        return '';
    }

}

export default new MovementsController();