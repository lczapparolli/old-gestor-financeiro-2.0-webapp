//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Helpers
import className from '../helpers/ClassNames';
//Css
import '../style/InputField.scss';

/**
 * Renders a HTML select field, with options that can be simple strings or an object with `text` and `value` properties.
 * Receives a `formHelper` and uses `onChange` and `onInvalid` as handlers for events
 */
function SelectField({ name, label, items, value, error, placeholder, formHelper, ...props }) {
    const classes = {
        'InputField': true,
        'Error': !!error
    };

    let errorMessage;
    if (error)
        errorMessage = <span>{error}</span>;

    const options = items.map((item, index) => {
        if (typeof item === 'string')
            return <option key={index}>{item}</option>;
        else
            return <option key={index} value={item.value}>{item.text}</option>;
    });

    let placeholderItem;
    if (placeholder)
        placeholderItem = <option value=''>{placeholder}</option>;
    
    return (
        <div className={className(classes)} >
            <label>{label}</label>
            <select name={name} value={value} {...props} onChange={formHelper.handleChange} onInvalid={formHelper.handleInvalid} >
                {placeholderItem}
                {options}
            </select>
            {errorMessage}
        </div>
    );
}

SelectField.propTypes = {
    /** The input name */
    name: PropTypes.string.isRequired,
    /** The caption of the field */
    label: PropTypes.string.isRequired,
    /** The list of options */
    items: PropTypes.oneOfType([ 
        PropTypes.arrayOf(PropTypes.string), 
        PropTypes.arrayOf(PropTypes.shape({ 
            text: PropTypes.string.isRequired, 
            value: PropTypes.any.isRequired 
        }))
    ]).isRequired,
    /** The value of the field */
    value: PropTypes.any,
    /** Error message when input is invalid */
    error: PropTypes.string,
    /** Default value, when no options is selected */
    placeholder: PropTypes.string,
    /** Helper instance to handle change and invalid events */
    formHelper: PropTypes.shape({handleChange: PropTypes.func, handleInvalid: PropTypes.func}).isRequired,
};

export default SelectField;