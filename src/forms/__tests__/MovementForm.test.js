//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import db from '../../db';
import formatNumber from '../../helpers/FormatNumber';
import formatDate, { FORMATS } from '../../helpers/FormatDate';
import MovementForm from '../MovementForm';
import forecastsCategoriesController from '../../controllers/ForecastsCategoriesController';
import forecastsController from '../../controllers/ForecastsController';
import accountsController from '../../controllers/AccountsController';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const accounts = [
    { name: 'Acc1', type: 'checking', balance: 0 },
    { name: 'CC1', type: 'credit', balance: 0 }
];
const forecastCategory = { name: 'Test category' };
const forecasts = [
    { name: 'Forecast 1', amount: 1.0 },
    { name: 'Forecast 2', amount: 2.0 },
];

const testData = {
    description: 'Test movement',
    value: -100,
    date: new Date(2019, 0 , 1),
    forecastId: 0,
    accountId: 0
};


describe('MovementForm component', () => {
    beforeAll(async () => {
        await db.accounts.clear();
        await db.forecasts_categories.clear();
        await db.forecasts.clear();

        const { id: forecastCategoryId } = await forecastsCategoriesController.saveCategory(forecastCategory);
        const savedForecasts = await Promise.all(forecasts.map(async (forecast) => {
            forecast.categoryId = forecastCategoryId;
            return forecastsController.saveForecast(forecast);
        }));
        
        const savedAccounts = await Promise.all(accounts.map(async (account) => accountsController.saveAccount(account)));
        testData.accountId = savedAccounts[0].id;
        testData.forecastId = savedForecasts[0].id;
    });
    
    it('renders a form with fields for account, forecast, description, date and amount', () => {
        //Initializing component
        const form = shallow(<MovementForm onSubmit={() => {}} />);
        //Test conditions
        cExpect(form).to.have.tagName('form');
        cExpect(form.find('SelectField[name="accountId"]')).to.exist;
        cExpect(form.find('SelectField[name="accountId"]')).to.have.prop('required');
        
        cExpect(form.find('SelectField[name="forecastId"]')).to.exist;
        cExpect(form.find('SelectField[name="forecastId"]')).to.have.prop('required');
        
        cExpect(form.find('InputField[name="description"]')).to.exist;
        cExpect(form.find('InputField[name="description"]')).to.have.prop('required');
        
        cExpect(form.find('InputField[name="value"]')).to.exist;
        cExpect(form.find('InputField[name="value"]')).to.have.prop('required');

        cExpect(form.find('InputField[name="date"]')).to.exist;
        cExpect(form.find('InputField[name="date"]')).to.have.prop('required');

        cExpect(form.find('Button')).to.exist;
    });

    it('fills the fields with empty data', () => {
        //Initializing component
        const form = shallow(<MovementForm onSubmit={() => {}}/>);
        //Test conditions
        cExpect(form.find('SelectField[name="accountId"]')).to.have.prop('value', 0);
        cExpect(form.find('SelectField[name="forecastId"]')).to.have.prop('value', 0);
        cExpect(form.find('InputField[name="description"]')).to.have.prop('value', '');
        cExpect(form.find('InputField[name="value"]')).to.have.prop('value', formatNumber(0));
        cExpect(form.find('InputField[name="date"]')).to.have.prop('value', formatDate(Date.now(), FORMATS.YYYYMMDD_FORMAT));
    });

    it('fills the selects with data from DB', async () => {
        //Initializing component
        const form = shallow(<MovementForm onSubmit={() => {}} />);
        //Wait component to be fully mounted
        await form.instance().componentDidMount();
        //Get components
        const accountSelect = form.find('SelectField[name="accountId"]');
        const forecastSelect = form.find('SelectField[name="forecastId"]');
        //Test conditions
        cExpect(accountSelect).to.have.prop('items').with.length(accounts.length);
        cExpect(forecastSelect).to.have.prop('items').with.length(forecasts.length);
        //Items should have value/text format
        cExpect(accountSelect).to.have.prop('items').with.nested.property('[0].value').greaterThan(0);
        cExpect(accountSelect).to.have.prop('items').with.nested.property('[0].text').not.empty;

        cExpect(forecastSelect).to.have.prop('items').with.nested.property('[0].value').greaterThan(0);
        cExpect(forecastSelect).to.have.prop('items').with.nested.property('[0].text').not.empty;
    });

    it('fills fields with movement data when a movement is provided', () => {
        //Initializing component
        const form = shallow(<MovementForm onSubmit={() => {}} movement={testData} />);
        //Test conditions
        cExpect(form.find('SelectField[name="accountId"]')).to.have.prop('value', testData.accountId);
        cExpect(form.find('SelectField[name="forecastId"]')).to.have.prop('value', testData.forecastId);
        cExpect(form.find('InputField[name="description"]')).to.have.prop('value', testData.description);
        cExpect(form.find('InputField[name="value"]')).to.have.prop('value', formatNumber(testData.value));
        cExpect(form.find('InputField[name="date"]')).to.have.prop('value', formatDate(testData.date, FORMATS.YYYYMMDD_FORMAT));
    });

    it('calls onSubmit function with movement data', done => {
        //Mock function
        const handleSubmit = movement => {
            cExpect(movement).to.have.property('description', testData.description);
            cExpect(movement).to.have.property('value', testData.value);
            cExpect(movement.date.getTime()).to.be.equal(testData.date.getTime());
            cExpect(movement).to.have.property('forecastId', testData.forecastId);
            cExpect(movement).to.have.property('accountId', testData.accountId);
            done();
        };
        //Initializes form
        const form = shallow(<MovementForm onSubmit={handleSubmit} />);
        //Setting data
        form.setState({ 
            description: { value: testData.description, error: '' },
            forecastId: { value: testData.forecastId, error: '' },
            accountId: { value: testData.accountId, error: '' },
            value: { value: formatNumber(testData.value), error: '' },
            date: { value: formatDate(testData.date), error: '' }
        });
        //Triggering submit
        form.find('form').simulate('submit', { preventDefault() {} });
    });

    it('validates date value', () => {
        //Initializing component
        const form = shallow(<MovementForm onSubmit={() => {}} />);

        cExpect(form.instance().dateValidation('01/01/2019')).to.be.empty;
        cExpect(form.instance().dateValidation('1/1/2019')).to.be.empty;
        cExpect(form.instance().dateValidation('2019-01-01')).to.be.empty;
        cExpect(form.instance().dateValidation('2019-1-1')).to.be.empty;
        //Invalid values
        cExpect(form.instance().dateValidation()).to.be.not.empty;
        cExpect(form.instance().dateValidation('')).to.be.not.empty;
        cExpect(form.instance().dateValidation('Invalid value')).to.be.not.empty;

    });

    it('validates amount value', () => {
        //Initializing component
        const form = shallow(<MovementForm onSubmit={() => {}} />);

        //Valid values
        cExpect(form.instance().amountValidation('')).to.be.empty;
        cExpect(form.instance().amountValidation('1')).to.be.empty;
        cExpect(form.instance().amountValidation('0,1')).to.be.empty;
        cExpect(form.instance().amountValidation('0,01')).to.be.empty;
        cExpect(form.instance().amountValidation('-0,01')).to.be.empty;
        cExpect(form.instance().amountValidation('-0,1')).to.be.empty;
        cExpect(form.instance().amountValidation('-1')).to.be.empty;
        cExpect(form.instance().amountValidation('1.000')).to.be.empty;
        cExpect(form.instance().amountValidation('-1.000')).to.be.empty;
        cExpect(form.instance().amountValidation('1.000,00')).to.be.empty;
        cExpect(form.instance().amountValidation('-1.000,00')).to.be.empty;
        //Invalid values
        cExpect(form.instance().amountValidation('invalid value')).to.be.not.empty;
        cExpect(form.instance().amountValidation('1,000.00')).to.be.not.empty;
        cExpect(form.instance().amountValidation('1.1.1')).to.be.not.empty;
    });
});