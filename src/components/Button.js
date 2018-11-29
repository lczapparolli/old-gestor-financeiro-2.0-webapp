//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Helpers
import classNames from '../helpers/ClassNames';
//Style
import '../style/Button.scss';

const ACTION_SUBMIT = 'submit';
const ACTION_BUTTON = 'button';
const BUTTON_ACTIONS = [ ACTION_SUBMIT, ACTION_BUTTON ];

const STYLE_DEFAULT = 'Default';
const STYLE_SUCESS = 'Sucess';
const STYLE_DANGER = 'Danger';
const BUTTON_STYLES = [ STYLE_DEFAULT, STYLE_SUCESS, STYLE_DANGER];

function Button({ caption, style, action, onClick }) {
    let classes = {
        'Button': true
    };
    classes[style] = true;

    return (
        <button className={classNames(classes)} type={action} onClick={onClick} >
            { caption }
        </button>
    );
}

Button.propTypes = {
    caption: PropTypes.string.isRequired,
    style: PropTypes.oneOf(BUTTON_STYLES),
    action: PropTypes.oneOf(BUTTON_ACTIONS),
    onClick: PropTypes.func
};

Button.defaultProps = {
    style: STYLE_DEFAULT,
    action: ACTION_BUTTON

};

export default Button;
export { ACTION_SUBMIT, ACTION_BUTTON, BUTTON_ACTIONS, STYLE_DEFAULT, STYLE_SUCESS, STYLE_DANGER, BUTTON_STYLES };