import { isNumeric } from './ConvertToNumber';

const DDMMYYYY = {
    REGEX: /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/,
    DAY_INDEX: 1,
    MONTH_INDEX: 2,
    YEAR_INDEX: 3
};
const YYYYMMDD = {
    REGEX: /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/,
    DAY_INDEX: 3,
    MONTH_INDEX: 2,
    YEAR_INDEX: 1
};

/**
 * @typedef {Object} DateStruct
 * @property {Number} day
 * @property {Number} month
 * @property {Number} year 
 */

/**
 * Extracts date fields from a string in dd/mm/yyyy format
 * @param {String} date The string to be parsed
 * @returns {DateStruct} Returns an object with dath fields
 */
function extractFields(value) {
    let dateFormat;

    if (DDMMYYYY.REGEX.test(value))
        dateFormat = DDMMYYYY;
    else if (YYYYMMDD.REGEX.test(value))
        dateFormat = YYYYMMDD;
    else
        throw new TypeError('Date format not indentified');

    const match = dateFormat.REGEX.exec(value);
    return {
        day: match[dateFormat.DAY_INDEX],
        month: match[dateFormat.MONTH_INDEX],
        year: match[dateFormat.YEAR_INDEX]
    };
}

/**
 * Checks if `value` is a Date object a number or a string date in dd/mm/yyyy format
 * @param {String|Date|Number} value Value to be checked
 * @returns {Boolean} Returns `true` if the value represents a valid date
 */
function isDate(value) {
    if (value instanceof Date)
        return true;
    if (typeof value === 'number')
        return true;
    if (isNumeric(value)) //Numeric strings
        return true;
    if (DDMMYYYY.REGEX.test(value) || YYYYMMDD.REGEX.test(value))
        return true;

    return false;
}

/**
 * Converts a value toa Date object. If value is a Date alread then it is returned.
 * @param {String|Date|Number} value Value to be converted
 * @returns {Date} The converted value
 */
function convertToDate(value) {
    if (value === undefined || value === null) 
        throw new TypeError('Value is required');
    if (typeof value !== 'number' && typeof value !== 'string' && !(value instanceof Date))
        throw new TypeError('Value must be a string, a number or a date');
    if (!isDate(value))
        throw new TypeError('Value is not a value date');
    
    if (value instanceof Date)
        return new Date(value.getTime());
    if (typeof value === 'number')
        return new Date(value);
    if (typeof value === 'string') {
        const dateFields = extractFields(value);
        return new Date(dateFields.year, dateFields.month - 1, dateFields.day);
    }
}

export { isDate, convertToDate };