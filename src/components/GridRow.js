import React from 'react';
import PropTypes from 'prop-types';

import '../style/GridRow.scss';

function GridRow({ children }) {
    return (
        <div className="GridRow">
            {children}
        </div>
    );
}

GridRow.propTypes = {
    children: PropTypes.any.isRequired
};

export default GridRow;