//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
//Tested module
import LoginForm from '../LoginForm';
import { ACTION_SUBMIT } from '../../components/Button';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const email = { value: '', error: '' };
const password = { value: '', error: '' };
const formHelper = { handleChange: function () {}, handleInvalid: function() {}};
const handleSubmit = function() {};


describe('Login form', () => {
    it('have inputs for email and password and a Button for form submission', () => {
        //Initializing page
        const page = shallow(<LoginForm email={email} password={password} formHelper={formHelper} handleSubmit={handleSubmit} />);
        //Conditions
        cExpect(page).to.have.descendants('form');
        cExpect(page.find('InputField[name="email"]')).to.be.present();
        cExpect(page.find('InputField[name="password"]')).to.be.present();
        cExpect(page.find('Button')).to.be.present().and.have.prop('action', ACTION_SUBMIT);
    });

});