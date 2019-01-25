//Regular expressions
const rxDecimalValue = /^-?\d{1,3}((\.\d{3})*|\d*),?\d*$/;

function convertToNumber(value) {
    validateString(value);
    let stringValue = value.toString();
    stringValue = stringValue.replace('.', '');
    stringValue = stringValue.replace(',', '.');
    return Number.parseFloat(stringValue);
}

function isNumeric(value) {
    if (typeof value === 'undefined' || value === null)
        return false;
    const stringValue = value.toString();
    return rxDecimalValue.test(stringValue);
}

function validateString(value) {
    if (typeof value === 'undefined' || value === null)
        throw new TypeError('Value required');
    if (typeof value !== 'string')
        throw new TypeError('Value must be a string');
    if (!isNumeric(value))
        throw new TypeError('Value must be a numeric string');
}

export { convertToNumber, isNumeric };