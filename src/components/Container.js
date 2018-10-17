//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Style
import '../style/Container.scss';

function Container({ children }) {
    return (
        <div className="Container">
            {children}
        </div>
    );
}

Container.propTypes = {
    children: PropTypes.any.isRequired
};

export default Container;