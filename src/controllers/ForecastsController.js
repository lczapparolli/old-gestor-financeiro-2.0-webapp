import forecasts from '../db/Forecasts';

/**
 * Forecast object
 * @typedef {Object} Forecast
 * @property {Number} id - Forecast id
 * @property {String} name - Forecast name (Required for insert)
 * @property {Number} amount - Forecast amount (Required for insert)
 */


//Symbols
const validateForecast = Symbol('validateForecast');
const extractField = Symbol('extractField');

class ForecastsController {

    /**
     * Adds or updates a forecast into database. If `id` field is filled, forecast with corresponding key will be updated.
     * @param {Forecast} forecast - Forecast object to be persisted to database (Added or updated)
     * @returns {Promise<Forecast>} - Returns the saved forecast with current id
     * @throws {TypeError} Throws an error with a validation message if Forecast fields are not valid
     */
    async saveForecast(forecast) {
        const validationMessage = this[validateForecast](forecast);
        if (validationMessage !== '')
            throw new TypeError(validationMessage);
        forecast = this[extractField](forecast);
        forecast.id = await forecasts.addForecast(forecast);
        return forecast;
    }

    //Private methods ---------------------------------------//
    
    /**
     * Validates a Forecast to be saved to database
     * @param {Forecast} forecast - Forecast object to be validated
     * @returns {String} Returns the error message, or an empty string if object is valid
     */
    [validateForecast](forecast) {
        if (!forecast)
            return 'Forecast is required';
        if (!forecast.name || forecast.name.toString().trim() === '')
            return 'Forecast name is required';
        if (typeof forecast.name !== 'string')
            return 'Forecast name must be a string';
        if (!forecast.amount)
            return 'Forecast amount is required';
        if (typeof forecast.amount !== 'number')
            return 'Forecast amount must be a number';
        return '';
    }

    /**
     * Extract only the necessary fields from parameter
     * @param {Forecast} forecast Original object to be cleaned
     * @returns {Forecast} Return a forecast object without extra properties
     */
    [extractField](forecast) {
        const result = {
            name: forecast.name,
            amount: forecast.amount
        };
        if (forecast.id && forecast.id > 0)
            result.id = forecast.id;
        return result;
    }
}

export default new ForecastsController();
