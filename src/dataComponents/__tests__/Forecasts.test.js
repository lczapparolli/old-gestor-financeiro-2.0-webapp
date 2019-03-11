//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import formatNumber from '../../helpers/FormatNumber';
//Tested module
import Forecasts, { Category, Forecast } from '../Forecasts';
import forecastsCategoriesController from '../../controllers/ForecastsCategoriesController';
import db from '../../db';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const testData = [
    {
        name: 'New Category 1',
        forecasts: [ 
            { id: 1, name: 'Forecast 1', amount: 10 },
            { id: 2, name: 'Forecast 2', amount: 10 } 
        ],
        total: 20
    },
    { name: 'New Category 2'},
    { name: 'New Category 3'},
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
    let category;

    beforeAll(() => {
        //Setting data
        category = testData[0];
        category.id = 1;
        //Initializing component
        component = shallow(<Category category={category} />);
    });

    describe('Component structure', () => {
        it('renders a header row with the category name and a link to category edition', () => {
            cExpect(component).to.have.descendants('tr.CategoryHeader');
            cExpect(component.find('th > Link')).to.contain(category.name);
            cExpect(component.find('Link')).to.have.prop('to', '/category/' + category.id);
        });

        it('renders a subtotal row', () => {
            cExpect(component).to.have.descendants('tr.CategoryTotal');
        });

        it('renders a Forecast component for each forecast in category', () => {
            cExpect(component.find('Forecast')).to.have.length(category.forecasts.length);
            cExpect(component.find('Forecast').first()).to.have.prop('forecast', category.forecasts[0]);
        });
    });
});

describe('Forecast component', () => {
    let component;
    let forecast;

    beforeAll(() => {
        //setting data
        forecast = testData[0].forecasts[0];
        component = shallow(<Forecast forecast={forecast} />);
    });

    describe('Component structure', () => {
        it('renders a table row with the forecast name, amount and a link to forecast edition', () => {
            cExpect(component).to.have.descendants('tr');
            cExpect(component.find('td > Link')).to.contain(forecast.name);
            cExpect(component.find('td > Link')).to.have.prop('to', '/forecast/' + forecast.id);
            cExpect(component.find('td.NumberField').first()).to.contain(formatNumber(forecast.amount, 'R$'));
        });
    });
});