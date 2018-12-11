//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
//Tested module
import LoginPage from '../LoginPage';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

describe('Login page', () => {
    it('renders a LoginForm', () => {
        //Initializing page
        const page = shallow(<LoginPage />);
        //Condition
        cExpect(page).to.have.descendants('LoginForm');
    });
});