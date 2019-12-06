//Helpers
import { convertToNumber, isNumeric } from './ConvertToNumber';

/**
 * Validates and convertes a month to a number
 * @param {Numeric|String} month The month part to be validated
 * @returns {Numberic} The month converted as a number
 * @throws {TypeError} Throws an error when te value is not valid
 */
function validateMonth(month) {
    if (!month)
        throw new TypeError('month required');
    if (!isNumeric(month))
        throw new TypeError('month must be a number');
    const intMonth = convertToNumber(month);
    if (intMonth < 1 || month > 12)
        throw new TypeError('month must be between 1 and 12');
    return intMonth;
}

/**
 * Validates and convertes a year to a number
 * @param {Numberic|String} year The year part to be validated
 * @returns {Number} The year converted as a number
 * @throws {TypeError} Throws an error when the value is not valid
 */
function validateYear(year) {
    if (!year)
        throw new TypeError('year required');
    if(!isNumeric(year))
        throw new TypeError('year must be a number');
    return convertToNumber(year);
}

/**
 * Returns a number with the month and year concatenated using the format YYYYMM
 * @param {Number|String} month The month part of the date to be formated
 * @param {Number|String} year The year part of the date to be formated
 * @returns {Number}
 */
function formatPeriod(month, year) {
    const intMonth = validateMonth(month);
    const intYear = validateYear(year);

    const formatedMonth = intMonth.toString().padStart(2, '0');
    const formatedYear = intYear.toString();
    return convertToNumber(formatedYear + formatedMonth);
}

export default formatPeriod;