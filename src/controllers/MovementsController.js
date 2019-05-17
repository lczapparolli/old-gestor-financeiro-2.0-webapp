import movements from '../db/Movements';
import accountsController from './AccountsController';
import forecastsController from './ForecastsController';
import { isNumeric } from '../helpers/ConvertToNumber';

/**
 * Movement object
 * @typedef {Object} Movement
 * @property {Number} id Movement id
 * @property {Number} accountId Id of corresponding account (Required)
 * @property {Number} forecastId Id of corresponding forecast (Required)
 * @property {Number} value Value of movement (Require)
 * @property {String} description Movement description and aditiona info
 * @property {Date} date Movement date (Required)
 */

//Symbols
const validateMovement = Symbol('validateMovement');
const validateAccountId = Symbol('validateAccountId');
const validateForecastId = Symbol('validateForecastId');
const validateValue = Symbol('validateValue');
const validateDate = Symbol('validateDate');
const extractFields = Symbol('extractFields');

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
    findAll() {
        return movements.getAllMovements();
    }

    //Private methods ---------------------------------------//

    /**
     * 
     * @param {Movement} movement
     * @returns {String}
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
     * @param {Number} accountId
     * @returns {String}
     */
    async [validateAccountId](accountId) {
        if (!accountId)
            return 'Account id is required';
        if (!isNumeric(accountId))
            return 'Account id must be a number';
        const account = await accountsController.getById(accountId);
        if (!account)
            return 'Account must exists';
        return '';
    }

    /**
     * 
     * @param {Number} forecastId 
     * @returns {String}
     */
    async [validateForecastId](forecastId) {
        if (!forecastId)
            return 'Forecast id is required';
        if (!isNumeric(forecastId))
            return 'Forecast id must be a number';
        const forecast = await forecastsController.getById(forecastId);
        if (!forecast)
            return 'Forecast must exists';
        return '';
    }

    /**
     * 
     * @param {Number} value
     * @returns {String}
     */
    [validateValue](value) {
        if (!value)
            return 'Value is required';
        if (!isNumeric(value))
            return 'Value must be a number';
        return '';
    }

    /**
     * 
     * @param {Date} date 
     * @returns {String}
     */
    [validateDate](date) {
        if (!date)
            return 'Date is required';
        if (typeof date === 'string' && isNaN(Date.parse(date)))
            return 'Date must be a valid date';
        if (!(date instanceof Date) && !isNumeric(date))
            return 'Date must be a valid date';
        return '';
    }

    [extractFields](movement) {
        let result = {
            accountId: movement.accountId,
            forecastId: movement.forecastId,
            description: movement.description,
            value: movement.value,
            date: movement.date
        };
        if(movement.id && movement.id > 0)
            result.id = movement.id;
        return result;
    }
}

export default new MovementsController();