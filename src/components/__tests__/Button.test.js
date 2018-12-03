//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import Button, { STYLE_SUCESS, ACTION_BUTTON, STYLE_DEFAULT, ACTION_SUBMIT } from '../Button';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

describe('Button component', () => {
    it('renders a HTML button with default properties', () => {
        const component = shallow(<Button caption="Test" />);
        
        cExpect(component).to.have.tagName('button');
        cExpect(component).to.have.prop('type', ACTION_BUTTON);
        cExpect(component).to.have.className('Button');
        cExpect(component).to.have.className(STYLE_DEFAULT);
    });

    it('renders the button with the `caption` as inner value', () => {
        const buttonCaption = 'Test';
        const component = shallow(<Button caption={buttonCaption} />);

        cExpect(component).to.contain(buttonCaption);
    });

    it('contains className based on the style passed as prop', () => {
        const component = shallow(<Button caption="Test" style={STYLE_SUCESS} />);

        cExpect(component).to.have.className(STYLE_SUCESS);
    });

    it('have the type of action specified', () => {
        const component = shallow(<Button caption="test" action={ACTION_SUBMIT} />);
        cExpect(component).to.have.prop('type', ACTION_SUBMIT);
    });

    it('call onClick prop when button is pressed', (done) => {
        const handleClick = () => {
            done();
        };
        const component = shallow(<Button caption="Test" onClick={handleClick} />);
        component.simulate('click');
    });
});