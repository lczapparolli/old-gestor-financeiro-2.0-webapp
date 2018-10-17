//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Helper
import classNames from '../helpers/ClassNames';
//Style
import '../style/GridCell.scss';

function GridCell({ children, shrink, noWrap }) {
    const classes = {
        'GridCell': true,
        'Shrink': shrink,
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
    shrink: PropTypes.bool,
    noWrap: PropTypes.bool
};

export default GridCell;