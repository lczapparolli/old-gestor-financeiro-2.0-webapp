//Libs
import chai from 'chai';
//Tested module
import FormHelper from '../FormHelper';

const cExpect = chai.expect;

class TestComponent {
    constructor() {
        this.state = { field1: { value: '', error: '' } };
    }

    setState() {}
}

const changeEvent = {
    preventDefault: function() {},
    target: {
        name: 'field1',
        value: 'fieldValue',
        validity: { valid: true }
    }
};

describe('FormHelper helper', () => {
    it('is a class', () => {
        cExpect(FormHelper).to.be.a('function');
    });

    it('receives an object and a list of methods on constructor and validates object needed properties', () => {
        const component = new TestComponent();
        const emptyClass = {};
        const validationCallbacks = {
            field1: function(value) { return value; }
        };
        cExpect(() => new FormHelper()).to.throw();
        cExpect(() => new FormHelper(emptyClass)).to.throw();
        cExpect(() => new FormHelper(component)).to.not.throw();
        cExpect(() => new FormHelper(component, validationCallbacks)).to.not.throw();
    });

    it('fires `setState` of the object when handleChange is called', (done) => {
        const component = new TestComponent();
        component.setState = (value) => {
            cExpect(value).to.have.nested.property('field1.value', changeEvent.target.value);
            done();
        };

        const formHelper = new FormHelper(component);
        formHelper.handleChange(changeEvent);
    });

    it('fires `setState` of the object with an error message when a invalid value is provided', (done) => {
        const errorMessage = 'Invalid value';
        const component = new TestComponent();
        component.setState = (value) => {
            cExpect(value).to.have.nested.property('field1.error', errorMessage);
            done();
        };

        const validationFunctions = {
            field1: function validateField1() {
                return errorMessage;
            }
        };

        const formHelper = new FormHelper(component, validationFunctions);
        formHelper.handleChange(changeEvent);
    });

    it('fires `setState` when an input rises an `onInvalid` event', (done) => {
        const component = new TestComponent();
        component.setState = (value) => {
            cExpect(value).to.have.nested.property('field1.error').not.empty;
            done();
        };

        changeEvent.target.validity.valid = false;
        changeEvent.target.validity.valueMissing = true;

        const formHelper = new FormHelper(component);
        formHelper.handleInvalid(changeEvent);
    });
});