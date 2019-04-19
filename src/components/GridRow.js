//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Helpers
import ScreenSizes from '../helpers/ScreenSizes';
import classNames from '../helpers/ClassNames';
//Style
import '../style/GridRow.scss';

/**
 * Encapsulates the row of a responsive grid.
 * The sizeBreak property indicates the largest screen size where cells keeps on the same row.
 * Below this size, cells occupy the entire width of the page.
 */
function GridRow({ children, sizeBreak,  alignTop}) {
    const classes = {
        'GridRow': true,
        'AlignTop': alignTop,
        'MiniBreak': sizeBreak === ScreenSizes.SCREEN_MINI,
        'SmallBreak': sizeBreak === ScreenSizes.SCREEN_SMALL,
        'MediumBreak': sizeBreak === ScreenSizes.SCREEN_MEDIUM,
        'LargeBreak': sizeBreak === ScreenSizes.SCREEN_LARGE,
        'HugeBreak': sizeBreak === ScreenSizes.SCREEN_HUGE
    };
    return (
        <div className={classNames(classes)} >
            {children}
        </div>
    );
}

GridRow.propTypes = {
    /** The children components */
    children: PropTypes.any.isRequired,
    /** The size of the screen on which the cells occupy the entire row */
    sizeBreak: PropTypes.number,
    /** Indicates if components should be aligned to top of the row */
    alignTop: PropTypes.bool
};

export default GridRow;