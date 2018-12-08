//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Helpers
import className from '../helpers/ClassNames';
//Style
import '../style/InputField.scss';

/**
 * Renders a HTML input with label and an error span when error message is provided.
 * Receives a `formHelper` and uses `onChange` and `onInvalid` as handlers for events
 */
function InputField({ name, label, error, formHelper, ...props }) {
    const classes = {
        'InputField': true,
        'Error': !!error
    };
    const handleChange = formHelper ? formHelper.handleChange : undefined;
    const handleInvalid = formHelper ? formHelper.handleInvalid : undefined;

    let errorMessage;
    if (error)
        errorMessage = <span>{error}</span>;

    return (
        <div className={className(classes)} >
            <label htmlFor={name} >{label}</label>
            <input name={name} id={name} onChange={handleChange} onInvalid={handleInvalid} {...props}  />
            {errorMessage}
        </div>
    );
}

InputField.propTypes = {
    /** The name used by the input field */
    name: PropTypes.string.isRequired,
    /** The caption of the field */
    label: PropTypes.string.isRequired,
    /** Helper instance to handle change and invalid events */
    formHelper: PropTypes.shape({handleChange: PropTypes.func, handleInvalid: PropTypes.func}).isRequired,
    /** Error message when input value is invalid */
    error: PropTypes.string
};

export default InputField;