//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Style
import '../style/Container.scss';

/**
 * This component encapsulates the Container of a page
 */
function Container({ children }) {
    return (
        <div className="Container">
            {children}
        </div>
    );
}

Container.propTypes = {
    /**The inner content of the container */
    children: PropTypes.any.isRequired
};

export default Container;