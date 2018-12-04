//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
//Tested module
import GridRow from '../GridRow';
import ScreenSizes from '../../helpers/ScreenSizes';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

describe('GridRow component', () => {
    it('renders a div with `GridRow` class', () => {
        const component = shallow(<GridRow />);

        cExpect(component).to.have.tagName('div');
        cExpect(component).to.have.className('GridRow');
    });

    it('renders the children', () => {
        const children = <p>Test</p>;
        const component = shallow(<GridRow>{children}</GridRow>);

        cExpect(component).to.contain(children);
    });

    it('has a different className according to `sizeBreak` property', () => {
        let component = shallow(<GridRow sizeBreak={ScreenSizes.SCREEN_MINI} />);
        cExpect(component).to.have.className('MiniBreak');

        component = shallow(<GridRow sizeBreak={ScreenSizes.SCREEN_SMALL} />);
        cExpect(component).to.have.className('SmallBreak');

        component = shallow(<GridRow sizeBreak={ScreenSizes.SCREEN_MEDIUM} />);
        cExpect(component).to.have.className('MediumBreak');

        component = shallow(<GridRow sizeBreak={ScreenSizes.SCREEN_LARGE} />);
        cExpect(component).to.have.className('LargeBreak');

        component = shallow(<GridRow sizeBreak={ScreenSizes.SCREEN_HUGE} />);
        cExpect(component).to.have.className('HugeBreak');
    });
}); 