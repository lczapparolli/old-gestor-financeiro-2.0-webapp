//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
//Tested module
import ConditionalRoute from '../ConditionalRoute';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

function LayoutElement({ children }) {
    return (<div>{children}</div>);
}

LayoutElement.propTypes = {
    children: PropTypes.any
};

function ChildElement() {
    return (<span>Test</span>);
}

describe('ConditionalRoute component', () => {
    it('renders a Route component', () => {
        //Initializing component
        const wrapper = shallow(<Router><ConditionalRoute path="/" component={ChildElement} /></Router>);
        const component = wrapper.find('ConditionalRoute').shallow();
        //Test condition
        cExpect(component).to.have.descendants('Route');
    });

    it('renders the Route component with the same `path` and `exact` property ', () => {
        //Test values
        const path = '/testPath';
        const exact = true;
        //Initializing component
        const wrapper = shallow(<Router><ConditionalRoute path={path} exact={exact} component={ChildElement} /></Router>);
        const component = wrapper.find('ConditionalRoute').shallow();
        //Test condition
        cExpect(component.find('Route')).to.have.prop('path', path);
        cExpect(component.find('Route')).to.have.prop('exact', exact);
    });

    it('renders the Route component with a `render function`', () => {
        //Initializing component
        const wrapper = shallow(<Router><ConditionalRoute path="/" component={ChildElement} /></Router>);
        const component = wrapper.find('ConditionalRoute').shallow();
        //Test condition
        cExpect(component.find('Route')).to.have.prop('render').not.null;
    });

    describe('Render function', () => {
        function getRenderedRoute(condition, redirect, component = ChildElement, layout = null) {
            //Initializing component
            const wrapper = shallow(<Router><ConditionalRoute path="/" component={component} layout={layout} condition={condition} redirect={redirect} /></Router>);
            //Wraps the ConditionalRoute
            const conditionalRoute = wrapper.find('ConditionalRoute').shallow();
            //Finds the Route element and executes the render method
            const renderedRoute = conditionalRoute.find('Route').prop('render')();
            //Wraps the return of render
            return shallow(<Router>{renderedRoute}</Router>);
        }

        it('returns a Redirect when condition is false and a redirect path is provided', () => {
            //Test value
            const redirectPath = '/redirect';
            const testComponent = getRenderedRoute(false, redirectPath);
            //Test condition
            cExpect(testComponent).to.have.descendants('Redirect');
            cExpect(testComponent.find('Redirect')).to.have.prop('to', redirectPath);
        });

        it('returns the component when condition is true', () => {
            //Test value
            const redirectPath = '/redirect';
            const testComponent = getRenderedRoute(true, redirectPath);
            //Test condition
            cExpect(testComponent).to.not.have.descendants('Redirect');
        });

        it('returns the component wrapped into Layout', () => {
            //Initialize component
            const testComponent = getRenderedRoute(true, '/', ChildElement, LayoutElement);
            //Test condition
            cExpect(testComponent).to.have.descendants(LayoutElement);
            cExpect(testComponent.find('LayoutElement')).to.have.descendants(ChildElement);
        });

        it('returns only the component when no layout is provided', () => {
            //Initialize component
            const testComponent = getRenderedRoute(true, '/', ChildElement, null);
            //Test condition
            cExpect(testComponent).to.not.have.descendants(LayoutElement);
            cExpect(testComponent).to.have.descendants(ChildElement);
        });
    });
});