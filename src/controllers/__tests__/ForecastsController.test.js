//Libs
import chai from 'chai';
//Tested module
import forecastsController from '../ForecastsController';
import forecasts from '../../db/Forecasts';
import db from '../../db';

const cExpect = chai.expect;

//Test data
const testData = [
    { name: 'Forecast 1', amount: 1.0 }
];

describe('ForecastsController', () => {
    it('is a object', () => {
        cExpect(forecastsController).to.be.an('object');
    });

    describe('Save Forecast action', () => {
        beforeEach(async () => {
            await db.forecasts.clear();
        });

        it('has a `saveForecast method`', () => {
            cExpect(forecastsController).to.respondsTo('saveForecast');
        });

        it('expects a forecast with a name and a value as parameter', async () => {
            let exception;

            exception = await forecastsController.saveForecast().catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Forecast is required');

            exception = await forecastsController.saveForecast({ }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Forecast name is required');

            exception = await forecastsController.saveForecast({ name: '' }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Forecast name is required');

            exception = await forecastsController.saveForecast({ name: ' ' }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Forecast name is required');

            exception = await forecastsController.saveForecast({ name: true }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Forecast name must be a string');

            exception = await forecastsController.saveForecast({ name: 'Valid name' }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Forecast amount is required');

            exception = await forecastsController.saveForecast({ name: 'Valid name', amount: null }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Forecast amount is required');

            exception = await forecastsController.saveForecast({ name: 'Valid name', amount: '' }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Forecast amount is required');

            exception = await forecastsController.saveForecast({ name: 'Valid name', amount: 'invalid amount' }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Forecast amount must be a number');
        });

        it('adds a forecast to database when no `id` is provided', async () => {
            //Save forecast
            const forecast = await forecastsController.saveForecast(testData[0]);
            //Test if it was added
            cExpect(forecast).to.have.property('name', testData[0].name);
            cExpect(forecast).to.have.property('id').greaterThan(0);
            //Load all forecasts from database
            const forecastList = await forecasts.getAllForecasts();
            cExpect(forecastList).to.have.lengthOf(1);
        });

        it('do not store more data than expected and do not change original object', async () => {
            //Save forecast
            let forecastTest = Object.assign({ otherValue: 'Unexpected' }, testData[0]);
            await forecastsController.saveForecast(forecastTest);
            //Test if original object is changed
            cExpect(forecastTest).to.not.have.property('id');
            cExpect(forecastTest).to.have.property('otherValue');
            //Load from database
            const forecastList = await forecasts.getAllForecasts();
            //Check if only one item is present
            cExpect(forecastList).to.have.lengthOf(1);
            //Test condition
            cExpect(forecastList[0]).to.not.have.property('otherValue');
            
        });

        it('updates a forecast when an `id` is provided', async () => {
            const newName = 'Updated name';
            //Save forecast
            const forecast = await forecastsController.saveForecast(testData[0]);
            //Change forecast name
            forecast.name = newName;
            //Update forecast
            await forecastsController.saveForecast(forecast);
            //Load from database
            const forecastList = await forecasts.getAllForecasts();
            //Check if only one item is present
            cExpect(forecastList).to.have.lengthOf(1);
            //Test condition
            cExpect(forecastList[0]).to.have.property('name', newName);
        });
    });
});
