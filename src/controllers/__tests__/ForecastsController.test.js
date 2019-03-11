//Libs
import chai from 'chai';
//Tested module
import forecastsController from '../ForecastsController';
import forecastsCategoriesController from '../ForecastsCategoriesController';
import forecasts from '../../db/Forecasts';
import db from '../../db';

const cExpect = chai.expect;

//Test data
const forecastTest = { name: 'Forecast 1', amount: 1.0 };
const categoryTest = { name: 'Test category' };
const categories = [
    {
        name: 'Category 1',
        forecasts: [
            { name: 'Forecast 1-1', amount: 1.1 },
            { name: 'Forecast 1-2', amount: 1.2 }
        ]
    },
    {
        name: 'Category 2',
        forecasts: [
            { name: 'Forecast 2-1', amount: 2.1 },
            { name: 'Forecast 2-2', amount: 2.1 }
        ]
    },
    {
        name: 'Category 3',
        forecasts: []
    }
];

describe('ForecastsController', () => {
    beforeAll(async () => {
        //Grants that Category exists
        await db.forecasts_categories.clear();
        forecastTest.categoryId = await db.forecasts_categories.put(categoryTest);
    });

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

        it('expects a forecast with name, amount and category_id as parameter', async () => {
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

            exception = await forecastsController.saveForecast({ name: 'Valid name', amount: 0 }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Category id is required');

            exception = await forecastsController.saveForecast({ name: 'Valid name', amount: 0, categoryId: 0 }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Category id is required');

            exception = await forecastsController.saveForecast({ name: 'Valid name', amount: 0, categoryId: 'invalid category' }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Category id must be a number');

            exception = await forecastsController.saveForecast({ name: 'Valid name', amount: 0, categoryId: -1 }).catch(exception => exception);
            cExpect(exception).to.be.an('error').and.have.property('message', 'Category must exists');

            //TODO: Check duplicated forecasts
        });

        it('adds a forecast to database when no `id` is provided', async () => {
            //Save forecast
            const forecast = await forecastsController.saveForecast(forecastTest);
            //Test if it was added
            cExpect(forecast).to.have.property('id').greaterThan(0);
            cExpect(forecast).to.have.property('name', forecastTest.name);
            cExpect(forecast).to.have.property('amount', forecastTest.amount);
            cExpect(forecast).to.have.property('categoryId', forecastTest.categoryId);
            //Load all forecasts from database
            const forecastList = await forecasts.getAllForecasts();
            cExpect(forecastList).to.have.lengthOf(1);
        });

        it('do not store more data than expected and do not change original object', async () => {
            //Save forecast
            let forecast = Object.assign({ otherValue: 'Unexpected' }, forecastTest);
            await forecastsController.saveForecast(forecastTest);
            //Test if original object is changed
            cExpect(forecast).to.not.have.property('id');
            cExpect(forecast).to.have.property('otherValue');
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
            const forecast = await forecastsController.saveForecast(forecastTest);
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

    describe('Load all forecasts action', () => {
        /** @type {import('../ForecastsController').ForecastList} */
        let forecastList;
        /** @type {Number} */
        let total = 0;

        /**
         * 
         * @param {import('../ForecastsController').Category} category 
         * @param {Number} categoryId 
         * @param {import('../ForecastsController').Forecast} forecast 
         */
        const addForecast = async (category, categoryId, forecast) => {
            //Set categoryId for forecast
            forecast.categoryId = categoryId;
            //Sums total for check
            total += forecast.amount;
            category.total += forecast.amount;
            //Insert forecast
            await forecastsController.saveForecast(forecast);
        };

        /**
         * Insert a category into database
         * @param {import('../ForecastsController').Category} category 
         */
        const addCategory = async category => {
            //Insert category and stores Id
            const inserted = await forecastsCategoriesController.saveCategory(category);
            //Inititalizes category total
            category.total = 0;
            await Promise.all(
                category.forecasts.map(async forecast => addForecast(category, inserted.id, forecast))
            );
        };

        beforeAll(async () => {
            //Clear all data
            await db.forecasts_categories.clear();
            await db.forecasts.clear();
            //Save test data
            await Promise.all(
                categories.map(async category => addCategory(category))
            );
            //Get forecasts
            forecastList = await forecastsController.findAll();
        });

        it('has a `findAll` method', () => {
            cExpect(forecastsController).to.respondsTo('findAll');
        });

        it('returns a list of categories with total sum of forecasts', () => {
            cExpect(forecastList).to.have.property('total', total);
            cExpect(forecastList).to.have.property('categories').with.length(categories.length);
        });

        it('returns each category with a subtotal and a list of forecasts', () => {
            cExpect(forecastList.categories[0]).to.have.property('name', categories[0].name);
            cExpect(forecastList.categories[0]).to.have.property('total', categories[0].total);
            cExpect(forecastList.categories[0]).to.have.property('forecasts').with.lengthOf(categories[0].forecasts.length);
        });

        it('returns an empty list when no forecast is added', () => {
            cExpect(forecastList.categories[2]).to.have.property('total', 0);
            cExpect(forecastList.categories[2]).to.have.property('forecasts').with.lengthOf(0);
        });
    });
});
