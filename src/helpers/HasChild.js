import { Children } from 'react';

function hasChild(children, typeOf) {
    return Children.toArray(children).some(child => child.type === typeOf);
}

export default hasChild;