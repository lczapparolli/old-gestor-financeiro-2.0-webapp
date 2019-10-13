//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import chaiSpies from 'chai-spies';
import { shallow } from 'enzyme';
import React from 'react';
//Tested module
import DateNavigator from '../DateNavigator';

chai.use(chaiEnzyme());
chai.use(chaiSpies);
const cExpect = chai.expect;

describe('DateNavigator component', () => {
    it('renders a div with an input and two buttons', () => {
        //Rendering component
        const component = shallow(<DateNavigator month="1" year="2019" onChange={() => {}} />);
        //Testing conditions
        cExpect(component).to.have.tagName('div');
        cExpect(component).to.have.descendants('input');
        cExpect(component.find('Button')).to.have.length(2);
    });

    it('input field keeps the value in the format mm/yyyy', () => {
        //Rendering component
        const component = shallow(<DateNavigator month="1" year="2019" onChange={() => {}} />);
        //Testing conditions
        cExpect(component.find('input')).to.have.value('01/2019');
    });

    it('calls an event with next month when next button is pressed', (done) => {
        //Event handler
        const handleEvent = (value) => {
            //Test conditions
            cExpect(value).to.have.property('month').equal(2);
            cExpect(value).to.have.property('year').equal(2019);
            done();
        };
        //Rendering component
        const component = shallow(<DateNavigator month="1" year="2019" onChange={handleEvent} />);
        //Clicking the button
        component.find('Button').at(1).simulate('click');
    });

    it('changes to previous month when "prior" button is pressed', (done) => {
        //Event handler
        const handleEvent = (value) => {
            //Test conditions
            cExpect(value).to.have.property('month').equal(1);
            cExpect(value).to.have.property('year').equal(2019);
            done();
        };
        //Rendering component
        const component = shallow(<DateNavigator month="2" year="2019" onChange={handleEvent} />);
        //Clicking the button
        component.find('Button').at(0).simulate('click');
    });

    it('increases the year when month reachs 13', (done) => {
        //Event handler
        const handleEvent = (value) => {
            //Test conditions
            cExpect(value).to.have.property('month').equal(1);
            cExpect(value).to.have.property('year').equal(2020);
            done();
        };
        //Rendering component
        const component = shallow(<DateNavigator  month="12" year="2019" onChange={handleEvent} />);
        //Clicking the button
        component.find('Button').at(1).simulate('click');
    });

    it('decreases the year when month reachs 0', (done) => {
        //Event handler
        const handleEvent = (value) => {
            //Test conditions
            cExpect(value).to.have.property('month').equal(12);
            cExpect(value).to.have.property('year').equal(2018);
            done();
        };
        //Rendering component
        const component = shallow(<DateNavigator month="1" year="2019" onChange={handleEvent} />);
        //Clicking the button
        component.find('Button').at(0).simulate('click');
    });

    it('fires the event when "Enter" is pressed', (done) => {
        //Event handler
        const handleEvent = (value) => {
            //Test conditions
            cExpect(value).to.have.property('month').equal(5);
            cExpect(value).to.have.property('year').equal(2019);
            done();
        };
        //Rendering component
        const component = shallow(<DateNavigator month="1" year="2019" onChange={handleEvent} />);
        const input = component.find('input');
        input.simulate('change', { target: { name: input.name, value: '05/2019' } });
        input.simulate('keyPress', { key: 'Enter' });
    });

    it('fires the event when input loose focus', (done) => {
        //Event handler
        const handleEvent = (value) => {
            //Test conditions
            cExpect(value).to.have.property('month').equal(5);
            cExpect(value).to.have.property('year').equal(2019);
            done();
        };
        //Rendering component
        const component = shallow(<DateNavigator month="1" year="2019" onChange={handleEvent} />);
        const input = component.find('input');
        input.simulate('change', { target: { name: input.name, value: '05/2019' } });
        input.simulate('blur');
    });

    it('does not fire the event when input value is invalid', () => {
        //Event handler
        const handleEvent = chai.spy();
        //Rendering component
        const component = shallow(<DateNavigator month="1" year="2019" onChange={handleEvent} />);
        const input = component.find('input');
        input.simulate('change', { target: { name: input.name, value: 'invalid' } });
        input.simulate('keyPress', { key: 'Enter' });
        cExpect(handleEvent).to.not.be.called;
        //Input returns to original value
        cExpect(component.find('input')).to.have.value('01/2019');

        //The same occours with blue event
        input.simulate('change', { target: { name: input.name, value: 'invalid' } });
        input.simulate('blur');
        cExpect(handleEvent).to.not.be.called;
        //Input returns to original value
        cExpect(component.find('input')).to.have.value('01/2019');
    });
});