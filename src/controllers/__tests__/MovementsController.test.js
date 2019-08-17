//Libs
import chai from 'chai';
//Tested module
import movementsController from '../MovementsController';
import db from '../../db';
import accounts from '../../db/Accounts';
import forecasts from '../../db/Forecasts';
import formatNumber from '../../helpers/FormatNumber';
import Movement from '../../models/Movement';

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

        account.id = await accounts.addAccount(account);
        forecast.id = await forecasts.addForecast(forecast);
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
            cExpect(movement).to.have.property('date');
            cExpect(movement.date.getTime()).to.be.equal(movementTest.date);
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
            //Save movement
            const movement = await movementsController.saveMovement(movementTest);
            //Change movement name
            movement.description = newDescription;
            //Update movement
            await movementsController.saveMovement(movement);
            //Load from database
            const movementList = await db.movements.toArray();
            //Check if only one item is present
            cExpect(movementList).to.have.lengthOf(1);
            //Test condition
            cExpect(movementList[0]).to.have.property('description', newDescription);
        });
        
        it('stores `date` field as Date object', async () => {
            //Save movement
            await movementsController.saveMovement(movementTest);
            //Load directly from DB
            const movementList = await db.movements.toArray();
            //Test condition
            cExpect(movementList).to.have.length(1);
            cExpect(movementList[0].date).to.be.a('Date');
        });
        
        it('stores `accountId`, `forecastId` and `value` fields as numbers', async () => {
            //Test data
            const numberTest = movementTest;
            numberTest.value = formatNumber(numberTest.value);
            numberTest.forecastId = numberTest.forecastId.toString();
            numberTest.accountId = numberTest.accountId.toString();
            //Save movement
            await movementsController.saveMovement(movementTest);
            //Load directly from DB
            const movementList = await db.movements.toArray();
            //Test condition
            cExpect(movementList).to.have.length(1);
            cExpect(movementList[0].value).to.be.a('Number');
            cExpect(movementList[0].accountId).to.be.a('Number');
            cExpect(movementList[0].forecastId).to.be.a('Number');
        });

        it('update account and forecast balance when inserted', async () => {
            //Load inserted account
            let savedAccount = await accounts.getById(account.id);
            let savedForecast = await forecasts.getById(forecast.id);
            const oldAccountBalance = savedAccount.balance;
            const oldForecastBalance = savedForecast.balance;
            //Test data
            const movement = {
                accountId: account.id,
                forecastId: forecast.id,
                date: new Date(),
                description: 'Insert test',
                value: 99.99
            };
            //Insert new movement
            await movementsController.saveMovement(movement);
            //Load account again
            savedAccount = await accounts.getById(account.id);
            savedForecast = await forecasts.getById(forecast.id);
            //Check value
            cExpect(savedAccount.balance).to.be.equal(oldAccountBalance + movement.value);
            cExpect(savedForecast.balance).to.be.equal(oldForecastBalance + movement.value);
        });

        it('update account and forecast balance when updated', async () => {
            //Load inserted account
            let savedAccount = await accounts.getById(account.id);
            let savedForecast = await forecasts.getById(forecast.id);
            const oldAccountBalance = savedAccount.balance;
            const oldForecastBalance = savedForecast.balance;
            const oldValue = 99.99;
            const newValue = 20;
            //Test data
            let movement = {
                accountId: account.id,
                forecastId: forecast.id,
                date: new Date(),
                description: 'Insert test',
                value: oldValue
            };
            //Insert new movement
            movement = await movementsController.saveMovement(movement);
            //Updates movement value
            movement.value = newValue;
            await movementsController.saveMovement(movement);
            //Load account again
            savedAccount = await accounts.getById(account.id);
            savedForecast = await forecasts.getById(forecast.id);
            //Check value
            cExpect(savedAccount.balance).to.be.equal(oldAccountBalance + newValue);
            cExpect(savedForecast.balance).to.be.equal(oldForecastBalance + newValue);
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
            //Returns with forecast and account data
            cExpect(movementList[0]).to.have.nested.property('account.name', account.name);
            cExpect(movementList[0]).to.have.nested.property('forecast.name', forecast.name);
        });

        it('returns an empty array when no movement was added', async () => {
            const movementList = await movementsController.findAll();
            cExpect(movementList).to.have.length(0);
        });
    });

    describe('Get by Id action', () => {
        it('has a `getById` method', () => {
            cExpect(movementsController).to.respondsTo('getById');
        });

        it('expects a number as parameter', async () => {
            let exception = await movementsController.getById().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Id is required');

            exception = await movementsController.getById('a').catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Id must be a number');

            exception = await movementsController.getById('1').catch(exception => exception);
            cExpect(exception).to.not.be.a('TypeException');
        });

        it('returns `null` when movement is not found', async () => {
            const movement = await movementsController.getById(100);
            cExpect(movement).to.be.null;
        });

        it('returns the movement when it is found', async () => {
            const savedMovement = await movementsController.saveMovement(movementTest);
            const movement = await movementsController.getById(savedMovement.id);
            cExpect(movement).to.be.not.null;
            cExpect(movement).to.be.an.instanceOf(Movement);
            cExpect(movement).to.have.property('id', savedMovement.id);
            cExpect(movement).to.have.property('description', savedMovement.description);
            cExpect(movement).to.have.property('accountId', savedMovement.accountId);
            cExpect(movement).to.have.property('forecastId', savedMovement.forecastId);
            cExpect(movement).to.have.property('value', savedMovement.value);
            cExpect(movement).to.have.property('date');
            cExpect(movement.date.getTime()).to.be.equal(movementTest.date);
        });
    });

    describe('Delete action', () => {
        it('has a `deleteMovement` method', () => {
            cExpect(movementsController).to.respondsTo('deleteMovement');
        });

        it('expects a number as parâmeter', async () => {
            let exception = await movementsController.deleteMovement().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Id is required');

            exception = await movementsController.deleteMovement('invalid').catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Id must be a number');

            //Accepts numeric string
            exception = await movementsController.deleteMovement('1').catch(exception => exception);
            cExpect(exception).to.not.be.a('TypeError');
        });

        it('deletes a movement by its Id', async () => {
            //Inserting test movement
            const insertedMovement = await movementsController.saveMovement(movementTest);
            //Checking database
            let movementList = await db.movements.toArray();
            cExpect(movementList).to.have.length(1);
            //Deleting movement
            await movementsController.deleteMovement(insertedMovement.id);
            //Checking database again
            movementList = await db.movements.toArray();
            cExpect(movementList).to.have.length(0);
        });

        it('update account and forecast balance', async () => {
            const newMovement = {
                description: 'Deletion test',
                date: new Date(),
                value: -100,
                accountId: account.id,
                forecastId: forecast.id
            };
            //Inserting test movement
            const insertedMovement = await movementsController.saveMovement(newMovement);
            //Loading account and forecast balance
            const { balance: oldAccountBalance } = await accounts.getById(account.id);
            const { balance: oldForecastBalance } = await accounts.getById(forecast.id);
            //Deleting movement
            await movementsController.deleteMovement(insertedMovement.id);
            //Loading new balances
            const { balance: newAccountBalance } = await accounts.getById(account.id);
            const { balance: newForecastBalance } = await accounts.getById(forecast.id);
            //Testing conditions
            cExpect(newAccountBalance).to.be.equal(oldAccountBalance - newMovement.value);
            cExpect(newForecastBalance).to.be.equal(oldForecastBalance - newMovement.value);
        });
    });
});