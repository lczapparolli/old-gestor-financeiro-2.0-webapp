//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
import Container from '../Container';
//Tested component
chai.use(chaiEnzyme());
const cExpect = chai.expect;

describe('Container component', () => {
    it('renders a div with `Container` class', () => {
        const component = shallow(<Container />);
        cExpect(component).to.have.tagName('div');
        cExpect(component).to.have.className('Container');
    });

    it('renders the children passed', () => {
        const children = (<p>teste</p>);
        const component = shallow(<Container>{children}</Container>);
        cExpect(component).to.contain(children);
    });
});