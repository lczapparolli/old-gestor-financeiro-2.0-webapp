//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Helpers
import classNames from '../helpers/ClassNames';
import hasChild from '../helpers/HasChild';
//Components
import GridRow from './GridRow';
//Style
import '../style/GridCell.scss';

function GridCell({ children, shrink, noWrap }) {
    const classes = {
        'GridCell': true,
        'Shrink': shrink,
        'NoWrap': noWrap,
        'InnerCell': hasChild(children, GridRow)
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