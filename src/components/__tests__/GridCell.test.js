//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
import GridCell from '../GridCell';
import GridRow from '../GridRow';
//Tested module

chai.use(chaiEnzyme());
const cExpect = chai.expect;

describe('GridCell component', () => {
    it('renders a div with `GridCell` class', () => {
        const component = shallow(<GridCell />);

        cExpect(component).to.have.tagName('div');
        cExpect(component).to.have.className('GridCell');
        cExpect(component).to.not.have.className('Shrink');
        cExpect(component).to.not.have.className('NoWrap');
        cExpect(component).to.not.have.className('InnerCell');
    });

    it('renders children', () => {
        const children = (<p>Test</p>);
        const component = shallow(<GridCell>{children}</GridCell>);

        cExpect(component).to.contain(children);
    });

    it('has `Shrink` class when property is set to true', () => {
        const component = shallow(<GridCell shrink={true}/>);

        cExpect(component).to.have.className('Shrink');
    });

    it('has `NoWrap` class when property is set to true', () => {
        const component = shallow(<GridCell noWrap={true}/>);

        cExpect(component).to.have.className('NoWrap');
    });

    it('has `InnerCell` class when a GridRow is a children', () => {
        const component = shallow(<GridCell><GridRow /></GridCell>);

        cExpect(component).to.have.className('InnerCell');
    });
});