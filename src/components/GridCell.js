import React from 'react';
import PropTypes from 'prop-types';
import '../style/GridCell.scss';

function GridCell({ children }) {
    return (
        <div className="GridCell">
            {children}
        </div>
    );
}

GridCell.propTypes = {
    children: PropTypes.any.isRequired
};

export default GridCell;