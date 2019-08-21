/**
 * Returns a string containing classnames provided.
 * 
 * If `classes` is an object, all propertie names with value equivalent to true are included to result.
 * If `classes` is an array, then all items are included to result
 * 
 * @param {Object|Array} classes - Object or array containing classnames to be joint
 * @returns {string}
 */
function ClassNames(classes) {
    let classNames = '';
    if (classes instanceof Array) {
        classNames = classes.join(' ');
    } else if (classes instanceof Object) {
        for (var key in classes) {
            if (classes.hasOwnProperty.call(classes, key) && !!classes[key]) {
                classNames += ' ' + key;
            }
        }
    }
    return classNames;
}

export default ClassNames;