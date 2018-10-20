//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Helpers
import ScreenSizes from '../helpers/ScreenSizes';
import classNames from '../helpers/ClassNames';
//Style
import '../style/GridRow.scss';

function GridRow({ children, sizeBreak }) {
    const classes = {
        'GridRow': true,
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
    children: PropTypes.any.isRequired,
    sizeBreak: PropTypes.number
};

export default GridRow;