//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
//Tested module
import HomePage from '../HomePage';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

describe('HomePage', () => {
    it('Have a link to Login page', () => {
        //Initializing page
        const page = shallow(<HomePage />);
        //Conditions
        cExpect(page.find('Link[to="/login"]')).to.exist;
    });
});