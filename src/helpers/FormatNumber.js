
/**
 * Validates and convert input value to assure that is a number
 * @param {String|Number} value Value to be formated
 * @returns {Number} Converted value
 * @throws {TypeError} Throws an exception when value is not a valid number
 */
function validate(value) {
    if (typeof value === 'undefined' || value === null)
        throw new TypeError('value required');
    
    const result = Number.parseFloat(value);

    if (Number.isNaN(result))
        throw new TypeError('value must be numeric');

    return result;
}

/**
 * Formats a number with 2 decimal places and thousands separator.
 * This functions is adapted to brazilian format with comma ',' as decimal separator and dots '.' as thousand separator.
 * @param {Number|String} value Number or numeric string to be formated
 * @param {String} currencySymbol Currency symbol to be included, default is blank
 * @returns {String} Formated value
 * @throws {TypeError} Throws an exception when value is not a valid number
 */
function formatNumber(value, currencySymbol = '') {
    value = validate(value);
    const negative = value < 0;
    const parts = Math.abs(value).toFixed(2).split('.');
    let integer = parts[0];
    const decimal = parts[1];

    if (integer.length > 3) {
        let position = integer.length % 3;
        while (position < integer.length) {
            integer = integer.slice(0, position) + '.' + integer.slice(position); 
            position += 4; //+4 to include new added char
        }
    }

    let result = (negative ? '-' : '') + (currencySymbol ? currencySymbol + ' ' : '') + integer + ',' + decimal;
    
    return result;
}

export default formatNumber;