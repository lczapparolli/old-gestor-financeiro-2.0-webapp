//Helpers
import validationMessage from './ValidationMessage';

/**
 * Represents a html input object
 * @typedef {Object} HtmlInput
 * @property {string} name
 * @property {string} value
 * @property {function} reportValidity
 * @property {ValidityState} validity
 */

/** 
 * An event fired by an input object
 * @typedef {Object} HtmlInputEvent
 * @property {HtmlInput} target
 * @property {function} preventDefault
 */

/**
 * Helper class to handle change events of form fields.
 * This helper also calls validation functions for each field individually.
 * 
 * The validation functions should return just an string with the error message. When field value is valid, an empty string should be returned.
 */
class FormHelper {
    /**
     * Creates a new instace of FormHelper attached to formPage
     * @param {React.Component} formPage The react component containing the state values and errors messages.
     * The state must contain an entry for each field with a `value` and a `error` property
     * @param {Object} validationCallbacks Object containg validation functions. The keys must be the names of fields to be validated
     */
    constructor(formPage, validationCallbacks) {
        this.formPage = formPage;
        this.validationCallbacks = validationCallbacks;
        this.handleChange = this.handleChange.bind(this);
        this.handleInvalid = this.handleInvalid.bind(this);
    }

    /**
     * Method for handling the input changes. Updates the state of `formPage` with the new value and error message.
     * @private
     * 
     * @param {HtmlInputEvent} event The event fired by the input element
     */
    handleChange(event) {
        const inputName = event.target.name;
        let inputData = Object.assign(this.formPage.state[inputName]);

        inputData.value = event.target.value;
        inputData.error = this.validate(inputName, inputData.value);
        
        if (!inputData.error)
        {
            event.target.reportValidity();
            inputData.error = validationMessage(event.target.validity);
        }

        this.formPage.setState({ [inputName]: inputData });
    }

    /**
     * @private
     * @param {HtmlInputEvent} event The event fired by the input element
     */
    handleInvalid(event) {
        event.preventDefault();
    }

    /**
     * Calls the validation method identified by `inputName`
     * @private
     * 
     * @param {string} inputName The name of the input to be validated
     * @param {*} value The value of the input
     */
    validate(inputName, value) {
        if (inputName in this.validationCallbacks)
            return this.validationCallbacks[inputName](value);
        else
            return '';
    }

}

export default FormHelper;