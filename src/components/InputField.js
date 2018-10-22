//Libs
import React from 'react';
import PropTypes from 'prop-types';
//Style
import '../style/InputField.scss';

function InputField({ name, placeholder, value, label }) {
    return (
        <div className="InputField">
            <label>{label}</label>
            <input name={name} placeholder={placeholder} value={value} />
        </div>
    );
}

InputField.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any
};

export default InputField;