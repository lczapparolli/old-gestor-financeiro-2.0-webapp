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

/**
 * This component encapsulates a cell of a responsive grid.
 * It is prepared to be nested with more Rows and Cells.
 */
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
    /** The child components */
    children: PropTypes.any.isRequired,
    /** Indicates that the cell should occupy the minimum space */
    shrink: PropTypes.bool,
    /** Indicates that the content should not have line breaks */
    noWrap: PropTypes.bool
};

export default GridCell;