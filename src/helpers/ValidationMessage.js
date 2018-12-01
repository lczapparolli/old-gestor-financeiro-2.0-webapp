/**
 * Returns a custom message for each type of error, or an empty string if input is valid
 * @param {ValidityState} validity The html input object
 * @returns {string} Returns a string containing the error message. If the input value is valid, an empty string is returned
 */
function validationMessage(validity) {
    if (validity && !validity.valid) {
        if (validity.patternMismatch) return 'Invalid value';
        if (validity.rangeOverflow) return 'Value must be higher';
        if (validity.rangeUnderflow) return 'Value must be lower';
        if (validity.stepMismatch) return 'Invalid precision';
        if (validity.tooLong) return 'Value is too long';
        if (validity.tooShort) return 'Value is too short';
        if (validity.typeMismatch) return 'Invalid value type';
        if (validity.valueMissing) return 'Fill the field';
    }
    return '';
}

export default validationMessage;