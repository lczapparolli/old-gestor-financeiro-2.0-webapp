import { Children } from 'react';

/**
 * Identify if the children array contain any node of the specified type.
 * Returns `true` if at least one children type correspond to the type.
 * 
 * @param {ReactNode} children A ReactNode received as children
 * @param {*} typeOf The class of the searched component
 * @returns {boolean}
 */
function hasChild(children, typeOf) {
    const childArray = Children.toArray(children);
    return childArray.some(child => child.type === typeOf || child.type.name === typeOf);
}

export default hasChild;