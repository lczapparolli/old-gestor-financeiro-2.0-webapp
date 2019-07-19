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
import forecastsController from '../../controllers/ForecastsController';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const testData = [
    {
        name: 'New Category 1',
        forecasts: [ 
            { id: 1, name: 'Forecast 1', amount: 10, balance: 5 },
            { id: 2, name: 'Forecast 2', amount: 10, balance: 5 } 
        ],
        total: 20,
        totalBalance: 10
    },
    { name: 'New Category 2', forecasts:[] },
    { name: 'New Category 3', forecasts:[] },
];

describe('Forecasts component', () => {
    let component;
    let total = 0;
    let totalBalance = 0;
    
    beforeAll(async () => {
        //Clear previous data and add new data
        await db.forecasts_categories.clear();
        await Promise.all(testData.map(async (category) => {
            const { id: categoryId } = await forecastsCategoriesController.saveCategory(category);
            return category.forecasts.map(async (forecast) => {
                forecast.categoryId = categoryId;
                total += forecast.amount;
                totalBalance += forecast.balance;
                return forecastsController.saveForecast(forecast);
            });
        }));
        //Initializing component
        component = shallow(<Forecasts />);
        //Wait component to be fully mounted
        await component.instance().componentDidMount();
    });

    describe('Component structure', () => {
        it('renders a title with a link to a new category and a table with 3 columns', () => {
            cExpect(component).to.have.descendants('h2');
            cExpect(component).to.have.descendants('Link');
            cExpect(component.find('Link')).to.have.prop('to', '/categories/new');
            cExpect(component).to.have.descendants('table');
            cExpect(component.find('thead > tr > th')).to.have.length(3);
        });

        it('renders a table with multiple categories', async () => {
            //Test conditions
            cExpect(component.find('Category')).to.have.length(testData.length);
        });

        it('shows the sum of forecasts amount and balance', () => {
            //First is total
            cExpect(component.find('tfoot .NumberField').first()).to.have.text(formatNumber(total, 'R$'));
            //Second is totalBalance
            cExpect(component.find('tfoot .NumberField').last()).to.have.text(formatNumber(totalBalance, 'R$'));
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
        it('renders a header row with the category name, a link to category edition and a link to add a forecast', () => {
            cExpect(component).to.have.descendants('tr.CategoryHeader');
            //First link to category edit
            cExpect(component.find('th > Link').first()).to.contain(category.name);
            cExpect(component.find('th > Link').first()).to.have.prop('to', '/categories/' + category.id);

            //Second link to add forecast
            cExpect(component.find('th > Link').last()).to.contain('+');
            cExpect(component.find('th > Link').last()).to.have.prop('to', '/forecasts/new?categoryId=' + category.id);
        });

        it('renders a subtotal row', () => {
            cExpect(component).to.have.descendants('tr.CategoryTotal');
            cExpect(component.find('tr.CategoryTotal > .NumberField').first()).to.have.text(formatNumber(category.total, 'R$'));
            cExpect(component.find('tr.CategoryTotal > .NumberField').last()).to.have.text(formatNumber(category.totalBalance, 'R$'));
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
            cExpect(component.find('td > Link')).to.have.prop('to', '/forecasts/' + forecast.id);
            cExpect(component.find('td.NumberField').first()).to.contain(formatNumber(forecast.amount, 'R$'));
            cExpect(component.find('td.NumberField').last()).to.contain(formatNumber(forecast.balance, 'R$'));
        });
    });
});