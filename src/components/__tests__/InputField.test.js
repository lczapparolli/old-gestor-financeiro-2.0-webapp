//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
//Tested module
import InputField from '../InputField';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test values
const inputName = 'test1';
const inputLabel = 'Input 1';
const inputValue = 'inputValue';
const errorMessage = 'Invalid value';
const mockHelper = {
    handleChange() {},
    handleInvalid() {}
};

describe('InputField component', () => {
    it('renders a `div` with a `label` and an `input`', () => {
        const component = shallow(<InputField name={inputName} label={inputLabel} formHelper={mockHelper} />);
 
        cExpect(component).to.have.tagName('div');
        cExpect(component).to.have.className('InputField');
        cExpect(component).to.have.descendants('label');
        cExpect(component).to.have.descendants('input');
        cExpect(component.find('label')).to.have.text(inputLabel);
        cExpect(component.find('input')).to.have.prop('name', inputName);
    });

    it('calls `formHelper.handleChange` when input changes', done => {
        //Creating mocked FormHelper
        const mockHelper = {
            //mocked handleChange
            handleChange(event) {
                //Checking event values
                cExpect(event).to.have.nested.property('target.name', inputName);
                cExpect(event).to.have.nested.property('target.value', inputValue);
                done(); //Completes the test
            }
        };

        //Initializing component
        const component = shallow(<InputField name={inputName} label={inputLabel} formHelper={mockHelper} />);
        const input = component.find('input');
        //Simulate input change
        input.simulate('change', { target: { name: inputName, value: inputValue } });
    });

    it('calls `formHelper.handleInvalid` when the input has an invalid value', done => {
        //Creating mocked FormHelper
        const mockHelper = {
            //mocked handleInvalid
            handleInvalid(event) {
                //Checking event values
                cExpect(event).to.have.nested.property('target.name', inputName);
                cExpect(event).to.have.nested.property('target.value', '');
                cExpect(event).to.have.nested.property('target.validity.valid', false);
                done();
            }
        };

        //Initializing component
        const component = shallow(<InputField name={inputName} label={inputLabel} formHelper={mockHelper} />);
        const input = component.find('input');
        //Simulate input invalidation
        input.simulate('invalid', { target: { name: inputName, value: '', validity: { valid: false } } });
    });

    it('renders an error label when an error message is provided', () => {
        //Test values
        const inputName = 'test1';
        //Initializing component
        const component = shallow(<InputField name={inputName} label={inputLabel} error={errorMessage} formHelper={mockHelper} />);
        //Conditions
        cExpect(component).to.have.className('Error'); //Have an Error class name
        cExpect(component).to.have.descendants('span'); //Have a span
        cExpect(component.find('span')).to.have.text(errorMessage); //The span contains the error message
    });

    it('not render the error label when no error is provided', () => {
        //Initializing component
        const component = shallow(<InputField name={inputName} label={inputLabel} formHelper={mockHelper} />);
        //Conditions
        cExpect(component).to.not.have.descendants('span'); //Not render the span
        cExpect(component).to.not.have.className('Error'); //Not have the Error class name
    });

    it('pass other props direct to input', () => {
        //Test values
        const inputType = 'password';
        //Initializing component
        const component = shallow(<InputField name={inputName} label={inputLabel} formHelper={mockHelper} type={inputType} />);
        //Conditions
        cExpect(component.find('input')).to.have.prop('type', inputType);
    });
});