//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import Forecasts, { Category } from '../Forecasts';
import forecastsCategoriesController from '../../controllers/ForecastsCategoriesController';
import db from '../../db';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const testData = [
    { id: 1, name: 'New Category 1'},
    { id: 2, name: 'New Category 2'},
    { id: 3, name: 'New Category 3'},
];

describe('Forecasts component', () => {
    let component;
    beforeAll(async () => {
        //Clear previous data and add new data
        await db.forecasts_categories.clear();
        await Promise.all(testData.map(async (category) => forecastsCategoriesController.saveCategory(category)));
        //Initializing component
        component = shallow(<Forecasts />);
        //Wait component to be fully mounted
        await component.instance().componentDidMount();
    });

    describe('Component structure', () => {
        it('renders a title with a link to a new category and a table with 3 columns', () => {
            cExpect(component).to.have.descendants('h2');
            cExpect(component).to.have.descendants('Link');
            cExpect(component.find('Link')).to.have.prop('to', '/category/new');
            cExpect(component).to.have.descendants('table');
            cExpect(component.find('thead > tr > th')).to.have.length(3);
        });

        it('renders a table with multiple categories', async () => {
            //Test conditions
            cExpect(component.find('Category')).to.have.length(testData.length);
        });
        
    });
});

describe('Category component', () => {
    let component;
    beforeAll(() => {
        //Initializing component
        component = shallow(<Category category={testData[0]} />);
    });

    describe('Component structure', () => {
        it('renders a table row with the category name and a link to category edition', () => {
            cExpect(component).to.have.descendants('tr');
            cExpect(component.find('td > Link')).to.contain(testData[0].name);
            cExpect(component.find('Link')).to.have.prop('to', '/category/' + testData[0].id);
        });
    });
});