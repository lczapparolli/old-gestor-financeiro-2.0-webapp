//Regular expressions
const rxDecimalValue = /^-?\d{1,3}((\.\d{3})*|\d*),?\d*$/;

/**
 * Converts a string to a number.
 * This function considers comma as decimal separator and dots as thousands separator
 * @param {String} value String value to be converted to Number
 * @returns {Number} Returns converted string
 */
function convertToNumber(value) {
    validateString(value);
    let stringValue = value.toString();
    stringValue = stringValue.replace('.', '');
    stringValue = stringValue.replace(',', '.');
    return Number.parseFloat(stringValue);
}

/**
 * Checks if value represents a number.
 * This function considers comma as decimal separator and dots as thousands separator
 * @param {*} value Value to be validated
 * @returns {Boolean} Returns true if value represents a number
 */
function isNumeric(value) {
    if (typeof value === 'undefined' || value === null)
        return false;
    const stringValue = value.toString();
    return rxDecimalValue.test(stringValue);
}

/**
 * Checks if value is a string and if it is in correct format
 * @param {String} value Value to be validated
 * @throws {TypeError} Throws type error when `value` is not a numeric string
 */
function validateString(value) {
    if (typeof value === 'undefined' || value === null)
        throw new TypeError('Value required');
    if (typeof value !== 'string')
        throw new TypeError('Value must be a string');
    if (!isNumeric(value))
        throw new TypeError('Value must be a numeric string');
}

export { convertToNumber, isNumeric };