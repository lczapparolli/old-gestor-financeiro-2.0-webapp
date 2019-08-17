//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import { convertToNumber } from '../../helpers/ConvertToNumber';
import formatNumber from '../../helpers/FormatNumber';
//Tested module
import ForecastForm from '../ForecastForm';
import Forecast from '../../models/Forecast';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const testData = {
    name: 'New forecast',
    amount: '10,00'
};

//Empty function
function emptySubmit() {}

describe('ForecastForm component', () => {
    it('renders a form with fields for forecast name and amount', () => {
        //Initializes form
        const form = shallow(<ForecastForm onSubmit={emptySubmit} />);
        //Test conditions
        cExpect(form).to.have.tagName('form');
        cExpect(form.find('InputField[name="name"]')).to.exist;
        cExpect(form.find('InputField[name="name"]')).to.have.prop('required');
        cExpect(form.find('InputField[name="amount"]')).to.exist;
        cExpect(form.find('InputField[name="amount"]')).to.have.prop('required');
        cExpect(form.find('Button')).to.exist;
    });

    it('fills fields with empty data when no forecast is provided', () => {
        //Initializes form
        const form = shallow(<ForecastForm onSubmit={emptySubmit} />);
        //Test conditions
        cExpect(form.find('InputField[name="name"]')).to.have.prop('value', '');        
        cExpect(form.find('InputField[name="amount"]')).to.have.prop('value', '0,00');
    });

    it('fills field with forecast data when a forecast is provided', () => {
        //Test data
        const forecast = new Forecast(
            'Forecast name',
            10.55
        );
        //Initializing component
        const form = shallow(<ForecastForm onSubmit={emptySubmit} forecast={forecast} />);
        //Test conditions
        cExpect(form.find('InputField[name="name"]')).to.have.prop('value', forecast.name);
        cExpect(form.find('InputField[name="amount"]')).to.have.prop('value', formatNumber(forecast.amount));
    });

    it('calls onSubmit function with forecast data', done => {
        //Mock function
        const handleSubmit = forecast => {
            cExpect(forecast).to.be.an.instanceOf(Forecast);
            cExpect(forecast).to.have.property('name', testData.name);
            cExpect(forecast).to.have.property('amount', convertToNumber(testData.amount));
            done();
        };
        //Initializes form
        const form = shallow(<ForecastForm onSubmit={handleSubmit} />);
        //Setting data
        form.setState({ 
            name: { value: testData.name, error: '' },
            amount: { value: testData.amount, error: '' }
        });
        //Triggering submit
        form.find('form').simulate('submit', { preventDefault() {} });
    });

    it('calls onNameValidation with forecast name', done => {
        const handleNameValidation = forecastName => {
            cExpect(forecastName).to.be.equal(testData.name);
            done();
        };
        
        //Initializing component
        const form = shallow(<ForecastForm onSubmit={emptySubmit} onNameValidation={handleNameValidation} />);
        //Setting data
        form.setState({ name: { value: testData.name, error: '' } });
        form.find('form').simulate('submit', { preventDefault() {} });
    });

    it('validates amount value', () => {
        //Initializing component
        const form = shallow(<ForecastForm onSubmit={emptySubmit} />);

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