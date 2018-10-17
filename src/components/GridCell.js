//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Helper
import classNames from '../helpers/ClassNames';
//Style
import '../style/GridCell.scss';

function GridCell({ children, expand, noWrap }) {
    const classes = {
        'GridCell': true,
        'Expand': expand,
        'NoWrap': noWrap
    };
    return (
        <div className={classNames(classes)} >
            {children}
        </div>
    );
}

GridCell.propTypes = {
    children: PropTypes.any.isRequired,
    expand: PropTypes.bool,
    noWrap: PropTypes.bool
};

export default GridCell;