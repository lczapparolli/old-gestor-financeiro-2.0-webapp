//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow, mount } from 'enzyme';
import React from 'react';
//Tested module
import LoginForm from '../LoginForm';
import { ACTION_SUBMIT } from '../../components/Button';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

describe('Login form', () => {
    it('have inputs for email and password and a Button for form submission', () => {
        //Initializing form
        const page = shallow(<LoginForm onSubmit={() => {}} />);
        //Conditions
        cExpect(page).to.have.descendants('form');
        cExpect(page.find('InputField[name="email"]')).to.be.present();
        cExpect(page.find('InputField[name="password"]')).to.be.present();
        cExpect(page.find('Button')).to.be.present().and.have.prop('action', ACTION_SUBMIT);
    });

    it('calls onSubmit function with email and password', done => {
        //Test data
        const email = { value: 'email@email.com', error: '' };
        const password = { value: 'password', error: '' };

        const onSubmit = data => {
            cExpect(data).to.have.property('email', email.value);
            cExpect(data).to.have.property('password', password.value);
            done();
        };
        //Initializing form
        const page = mount(<LoginForm onSubmit={onSubmit} />);

        page.setState({ email, password });
        page.find('form').simulate('submit');
    });
});