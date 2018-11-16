//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Helpers
import className from '../helpers/ClassNames';
//Style
import '../style/InputField.scss';

function InputField({ name, label, error, formHelper, ...props }) {
    const classes = {
        'InputField': true,
        'Error': !!error
    };

    let errorMessage;
    if (error)
        errorMessage = <span>{error}</span>;

    return (
        <div className={className(classes)} >
            <label htmlFor={name} >{label}</label>
            <input name={name} id={name} onChange={formHelper.handleChange} onInvalid={formHelper.handleInvalid} {...props}  />
            {errorMessage}
        </div>
    );
}

InputField.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    formHelper: PropTypes.shape({handleChange: PropTypes.func, handleInvalid: PropTypes.func}).isRequired,
    error: PropTypes.string
};

export default InputField;