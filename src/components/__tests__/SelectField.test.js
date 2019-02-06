//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import SelectField from '../SelectField';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

const testData = {
    caption: 'Test field',
    name: 'select1',
    errorMessage: 'Test error message',
    placeholder: 'Placeholder value',
    stringItems: [ 'Item 1', 'Item 2', 'Item 3' ],
    objectItems: [
        { text: 'Item 1', value: 'Value 1' },
        { text: 'Item 2', value: 'Value 2' },
        { text: 'Item 3', value: 'Value 3' },
        { text: 'Item 4', value: 'Value 4' }
    ]
};
const mockHelper = {
    handleChange() {},
    handleInvalid() {}
};

describe('SelectField component', () => {
    it('renders a `div` with a `label` and a `select` component', () => {
        const component = shallow(<SelectField name={testData.name} label={testData.caption} items={testData.stringItems} formHelper={mockHelper} />);

        //Test conditions
        cExpect(component).to.have.tagName('div');
        cExpect(component).to.have.className('InputField');
        cExpect(component.find('label')).to.have.text(testData.caption);
        cExpect(component.find('select')).to.have.prop('name', testData.name);
    });

    it('renders a list of options based on a list of strings', () => {
        const component = shallow(<SelectField name={testData.name} label={testData.caption} items={testData.stringItems} formHelper={mockHelper} />);

        //Test conditions
        cExpect(component.find('option')).to.have.length(testData.stringItems.length);
        cExpect(component.find('option').first()).to.have.text(testData.stringItems[0]);
        cExpect(component.find('option').at(1)).to.have.text(testData.stringItems[1]);
    });

    it('renders a list of options based on a list of objects with `text` and `value` properties', () => {
        const component = shallow(<SelectField name={testData.name} label={testData.caption} items={testData.objectItems} formHelper={mockHelper} />);

        //Test conditions
        cExpect(component.find('option')).to.have.length(testData.objectItems.length);
        cExpect(component.find('option').first()).to.have.text(testData.objectItems[0].text);
        cExpect(component.find('option').first()).to.have.prop('value', testData.objectItems[0].value);
        cExpect(component.find('option').at(1)).to.have.text(testData.objectItems[1].text);
        cExpect(component.find('option').at(1)).to.have.prop('value', testData.objectItems[1].value);
    });

    it('can render a default option when no value is selected', () => {
        const component = shallow(<SelectField name={testData.name} label={testData.caption} items={testData.objectItems} placeholder={testData.placeholder} formHelper={mockHelper} />);

        //Creates an extra option
        cExpect(component.find('option')).to.have.length(testData.objectItems.length + 1);
        //First item is the placeholder
        cExpect(component.find('option').first()).to.have.text(testData.placeholder);
        //Select value is empty
        cExpect(component.find('select')).to.have.value('');
    });

    it('renders an error label when an error message is provided', () => {
        const component = shallow(<SelectField name={testData.name} label={testData.caption} items={testData.objectItems} error={testData.errorMessage} formHelper={mockHelper} />);
        //Test conditions
        cExpect(component).to.have.className('Error'); //Have an Error class name
        cExpect(component).to.have.descendants('span'); //Have a span
        cExpect(component.find('span')).to.have.text(testData.errorMessage); //The span contains the error message
    });

    it('not render the error label when no error is provided', () => {
        const component = shallow(<SelectField name={testData.name} label={testData.caption} items={testData.objectItems} formHelper={mockHelper} />);
        //Test conditions
        cExpect(component).to.not.have.className('Error'); //Have an Error class name
        cExpect(component).to.not.have.descendants('span'); //Have a span
    });

    it('renders the component with initial value', () => {
        const component = shallow(<SelectField name={testData.name} label={testData.caption} items={testData.stringItems} value={testData.stringItems[2]} formHelper={mockHelper} />);

        //Test condition
        cExpect(component.find('select')).to.have.prop('value', testData.stringItems[2]);
    });

    it('calls `formHelper.handleChange` when value changes', done => {
        //Creating mocked FormHelper
        const mockHelper = {
            //mocked handleChange
            handleChange(event) {
                //Checking event values
                cExpect(event).to.have.nested.property('target.name', testData.name);
                cExpect(event).to.have.nested.property('target.value', testData.stringItems[0]);
                done(); //Completes the test
            }
        };

        //Initializing component
        const component = shallow(<SelectField name={testData.name} label={testData.caption} items={testData.stringItems} formHelper={mockHelper} />);
        const input = component.find('select');
        //Simulate input change
        input.simulate('change', { target: { name: testData.name, value: testData.stringItems[0] } });
    });

    it('calls `formHelper.handleInvalid` when input has an invalid value', done => {
        //Creating mocked FormHelper
        const mockHelper = {
            //mocked handleInvalid
            handleInvalid(event) {
                //Checking event values
                cExpect(event).to.have.nested.property('target.name', testData.name);
                cExpect(event).to.have.nested.property('target.value', '');
                cExpect(event).to.have.nested.property('target.validity.valid', false);
                done();
            }
        };

        //Initializing component
        const component = shallow(<SelectField name={testData.name} label={testData.caption} items={testData.stringItems} formHelper={mockHelper} />);
        const input = component.find('select');
        //Simulate input invalidation
        input.simulate('invalid', { target: { name: testData.name, value: '', validity: { valid: false } } });
    });

    it('pass other props direct to select', () => {
        //Initializing component
        const component = shallow(<SelectField required name={testData.name} label={testData.caption} items={testData.stringItems} formHelper={mockHelper} />);
        //Conditions
        cExpect(component.find('select')).to.have.prop('required');
    });
});