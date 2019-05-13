//Libs
import chai from 'chai';
//Tested module
import movementsController from '../MovementsController';
import db from '../../db';

const cExpect = chai.expect;

//Test data
const account = { name: 'Test account', balance: 0, type: 'checking'};
const forecast = { name: 'Test account', amount: 0, categoryId: 0};
const movementTest = { accountId: 0, forecastId: 0, value: 10, date: Date.now(), description: 'Test movement' };

describe('MovementsController', () => {
    beforeAll(async () => {
        //Grants that an account and a forecasts exists
        await db.accounts.clear();
        await db.forecasts.clear();

        const categories = await db.forecasts_categories.toArray();
        forecast.categoryId = categories[0].id;

        account.id = await db.accounts.put(account);
        forecast.id = await db.forecasts.put(forecast);
        movementTest.accountId = account.id;
        movementTest.forecastId = forecast.id;
    });

    beforeEach(async () => {
        await db.movements.clear();
    });

    it('is an object', () => {
        cExpect(movementsController).to.be.an('object');
    });

    describe('Save movement action', () => {

        it('has a `saveMovement` method', () => {
            cExpect(movementsController).to.respondsTo('saveMovement');
        });

        it('expects a movement with accountId, forecastId, description, value and date fields', async () => {
            let exception;

            exception = await movementsController.saveMovement().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Movement is required');

            //accountId
            exception = await movementsController.saveMovement({}).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account id is required');
            exception = await movementsController.saveMovement({ accountId: '' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account id is required');
            exception = await movementsController.saveMovement({ accountId: 0 }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account id is required');
            exception = await movementsController.saveMovement({ accountId: 'a' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account id must be a number');
            exception = await movementsController.saveMovement({ accountId: 99999 }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account must exists');

            //forecastId
            exception = await movementsController.saveMovement({ accountId: account.id }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Forecast id is required');
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: '' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Forecast id is required');
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: 'a' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Forecast id must be a number');
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: 0 }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Forecast id is required');
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: 99999 }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Forecast must exists');

            //value
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: forecast.id }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Value is required');
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: forecast.id, value: '' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Value is required');
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: forecast.id, value: 0 }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Value is required');
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: forecast.id, value: 'a' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Value must be a number');

            //date
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: forecast.id, value: 10 }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Date is required');
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: forecast.id, value: 10, date: '' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Date is required');
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: forecast.id, value: 10, date: 'a' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Date must be a valid date');

            //valid movement
            exception = await movementsController.saveMovement({ accountId: account.id, forecastId: forecast.id, value: 10, date: Date.now() }).catch(exception => exception);
            cExpect(exception).to.not.be.an.instanceOf(Error);
        });

        it('adds a movement to database when no `id` is provided', async () => {
            //Save movement
            const movement = await movementsController.saveMovement(movementTest);
            //Test inserted values
            cExpect(movement).to.have.property('id').greaterThan(0);
            cExpect(movement).to.have.property('description', movementTest.description);
            cExpect(movement).to.have.property('accountId', movementTest.accountId);
            cExpect(movement).to.have.property('forecastId', movementTest.forecastId);
            cExpect(movement).to.have.property('value', movementTest.value);
            cExpect(movement).to.have.property('date', movementTest.date);
            //Should not touch original object
            cExpect(movementTest).to.not.have.property('id');
            //Check if it is in database
            const movementList = await db.movements.toArray();
            cExpect(movementList).to.have.lengthOf(1);
        });

        it('do not store more data than expected and do not change original object', async () => {
            //Save movement
            let movement = Object.assign({ otherValue: 'Unexpected' }, movementTest);
            await movementsController.saveMovement(movement);
            //Test if original object is changed
            cExpect(movement).to.not.have.property('id');
            cExpect(movement).to.have.property('otherValue');
            //Load from database
            const movementList = await db.movements.toArray();
            //Check if only one item is present
            cExpect(movementList).to.have.lengthOf(1);
            //Test condition
            cExpect(movementList[0]).to.not.have.property('otherValue');
        });

        it('updates a movement when an `id` is provided', async () => {
            const newDescription = 'Updated name';
            //Save forecast
            const movement = await movementsController.saveMovement(movementTest);
            //Change forecast name
            movement.description = newDescription;
            //Update forecast
            await movementsController.saveMovement(movement);
            //Load from database
            const movementList = await db.movements.toArray();
            //Check if only one item is present
            cExpect(movementList).to.have.lengthOf(1);
            //Test condition
            cExpect(movementList[0]).to.have.property('description', newDescription);
        });

    });

    describe('Load all movements action', () => {
        it('has a `findAll` method', () => {
            cExpect(movementsController).to.respondsTo('findAll');
        });

        it('returns an array with all movements', async () => {
            await movementsController.saveMovement(movementTest);
            const movementList = await movementsController.findAll();
            cExpect(movementList).to.have.length(1);
            cExpect(movementList[0]).to.have.property('description', movementTest.description);
        });

        it('returns an empty array when no movement was added', async () => {
            const movementList = await movementsController.findAll();
            cExpect(movementList).to.have.length(0);
        });
    });

    describe('Get by Id action', () => {});
});