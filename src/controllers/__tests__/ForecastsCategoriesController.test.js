//Libs
import chai from 'chai';
//Tested module
import forecastsCategoriesController, { PREDICTED, INCOME, UNPREDICTED } from '../ForecastsCategoriesController';
import forecastsCategories from '../../db/ForecastsCategories';
import db from '../../db';

const cExpect = chai.expect;

//Test data
const testData = [
    { name: 'New Category 1'},
    { name: 'New Category 2'},
    { name: 'New Category 3'},
];

describe('ForecastsCategoriesController', () => {
    it('is a object', () => {
        cExpect(forecastsCategoriesController).to.be.a('object');
    });

    describe('Initial data', () => {
        it('initializes with three categories', async () => {
            const categories = await forecastsCategoriesController.findAll();
            cExpect(categories).to.have.length(3);
            cExpect(categories[0]).to.have.property('type', INCOME);
            cExpect(categories[1]).to.have.property('type', PREDICTED);
            cExpect(categories[2]).to.have.property('type', UNPREDICTED);
        });
    });

    describe('Save Category action', () => {
        beforeEach(async () => {
            await db.forecasts_categories.clear();
        });

        it('has a `saveCategory` function that returns a promise', () => {
            cExpect(forecastsCategoriesController).to.respondsTo('saveCategory');
        });

        it('expects a category with name property', async () => {
            let exception;

            //TODO:Padronize exceptions

            exception = await forecastsCategoriesController.saveCategory().catch(exception => exception);
            cExpect(exception).to.be.equal('Category is required');

            exception = await forecastsCategoriesController.saveCategory({ }).catch(exception => exception);
            cExpect(exception).to.be.equal('Category name is required');

            exception = await forecastsCategoriesController.saveCategory({ name: '' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Category name is required');

            exception = await forecastsCategoriesController.saveCategory({ name: '  ' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Category name is required');

            await forecastsCategoriesController.saveCategory(testData[1]);
            exception = await forecastsCategoriesController.saveCategory(testData[1]).catch(exception => exception);
            cExpect(exception).to.be.equal('Category already exists');
        });

        it('saves the inserted category into database with type equals `predicted`', async () => {
            //Save category
            const addedCategory = await forecastsCategoriesController.saveCategory(testData[0]);
            cExpect(addedCategory).to.have.property('name', testData[0].name);
            cExpect(addedCategory).to.have.property('id').greaterThan(0);
            //Load all categories from database
            const categoryList = await forecastsCategories.getAllCategories();
            //Test conditions
            cExpect(categoryList).to.have.length(1);
            cExpect(categoryList[0]).to.have.property('name', testData[0].name);
            cExpect(categoryList[0]).to.have.property('type', PREDICTED); //New categories are always of type predicted
        });

        it('updates if is passed an existent category', async () => {
            const newName = 'New name';
            //Save category
            const addedCategory = await forecastsCategoriesController.saveCategory(testData[0]);
            //Changing values
            addedCategory.name = newName;
            //Updating category
            await forecastsCategoriesController.saveCategory(addedCategory);
            //Load all categories from database
            const categoryList = await forecastsCategories.getAllCategories();
            //Test conditions
            cExpect(categoryList).to.have.length(1);
            cExpect(categoryList[0]).to.have.property('name', newName);
        });

        it('does not change type', async () => {
            const addedCategory = await forecastsCategoriesController.saveCategory(testData[0]);
            //Changing values
            addedCategory.type = INCOME;
            //Updating category
            await forecastsCategoriesController.saveCategory(addedCategory);
            //Load all categories from database
            const categoryList = await forecastsCategories.getAllCategories();
            //Test conditions
            cExpect(categoryList).to.have.length(1);
            cExpect(categoryList[0]).to.have.property('type', PREDICTED);
        });
    });

    describe('Load all categories action', () => {
        beforeEach(async () => {
            await db.forecasts_categories.clear();
        });

        it('has a `findAll` method', () => {
            cExpect(forecastsCategoriesController).to.respondsTo('findAll');
        });

        it('returns all categories inserted', async () => {
            await Promise.all(testData.map(async (category) => forecastsCategoriesController.saveCategory(category)));
            //Loading data
            const categories = await forecastsCategoriesController.findAll();
            //Test conditions
            cExpect(categories).to.be.an('array');
            cExpect(categories).to.have.length(testData.length);
        });
    });

    describe('Get by id action', () => {
        beforeEach(async () => {
            await db.forecasts_categories.clear();
        });

        it('has a `getById` method', () => {
            cExpect(forecastsCategoriesController).to.respondsTo('getById');
        });

        it('Expects an number as parameter', async () => {
            const exception = await forecastsCategoriesController.getById().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Id is required');
        });

        it('Returns null when the category does not exists', async () => {
            const category = await forecastsCategoriesController.getById(100);
            cExpect(category).to.be.null;
        });

        it('Returns the category when it is found', async () => {
            const { id: lastInsertedId } = await forecastsCategoriesController.saveCategory(testData[0]);
            const category = await forecastsCategoriesController.getById(lastInsertedId);
            cExpect(category).to.be.not.null;
            cExpect(category).to.have.property('id', lastInsertedId);
            cExpect(category).to.have.property('name', testData[0].name);
        });

        it('works when the id passed is a string', async () => {
            const { id: lastInsertedId } = await forecastsCategoriesController.saveCategory(testData[0]);
            const category = await forecastsCategoriesController.getById(lastInsertedId.toString());
            cExpect(category).to.be.not.null;
        });
    });

    describe('Get by name action', () => {
        beforeEach(async () => {
            await db.forecasts_categories.clear();
        });

        it('has a `getByName` method', () => {
            cExpect(forecastsCategoriesController).to.respondsTo('getByName');
        });

        it('expects a string as parameter', async () => {
            const exception = await forecastsCategoriesController.getByName().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Category name is required');
        });

        it('returns a category when a existent name is provided', async () => {
            await forecastsCategoriesController.saveCategory(testData[0]);
            const category = await forecastsCategoriesController.getByName(testData[0].name);
            cExpect(category).to.be.not.null;
            cExpect(category).to.have.property('id').greaterThan(0);
            cExpect(category).to.have.property('name', testData[0].name);
        });

        it('returns null when a inexistent name is provided', async () => {
            const category = await forecastsCategoriesController.getByName('inexistent category');
            cExpect(category).to.be.null;
        });
    });
});
