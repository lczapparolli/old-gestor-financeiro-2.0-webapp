//Libs
import chai from 'chai';
//Tested module
import forecastsCategoriesController, { PREDICTED, INCOME } from '../ForecastsCategoriesController';
import forecastsCategories from '../../db/ForecastsCategories';
import db from '../../db';

const cExpect = chai.expect;

//Test data
const testData = { name: 'New Category '};

describe('ForecastsCategoriesController', () => {
    beforeEach(() => {
        db.forecasts_categories.clear();
    });

    it('is a object', () => {
        cExpect(forecastsCategoriesController).to.be.a('object');
    });

    describe('Save Category action', () => {
        it('has a `saveCategory` function that returns a promise', () => {
            cExpect(forecastsCategoriesController).to.respondsTo('saveCategory');
        });

        it('expects a category with name property', async () => {
            let exception;

            exception = await forecastsCategoriesController.saveCategory().catch(exception => exception);
            cExpect(exception).to.be.equal('Category is required');

            exception = await forecastsCategoriesController.saveCategory({ }).catch(exception => exception);
            cExpect(exception).to.be.equal('Category name is required');

            exception = await forecastsCategoriesController.saveCategory({ name: '' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Category name is required');

            exception = await forecastsCategoriesController.saveCategory({ name: '  ' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Category name is required');
        });

        it('saves the inserted category into database with type equals `predicted`', async () => {
            //Save category
            const addedCategory = await forecastsCategoriesController.saveCategory(testData);
            cExpect(addedCategory).to.have.property('name', testData.name);
            cExpect(addedCategory).to.have.property('id').greaterThan(0);
            //Load all categories from database
            const categoryList = await forecastsCategories.getAllCategories();
            //Test conditions
            cExpect(categoryList).to.have.length(1);
            cExpect(categoryList[0]).to.have.property('name', testData.name);
            cExpect(categoryList[0]).to.have.property('type', PREDICTED); //New categories are always of type predicted
        });

        it('updates if is passed an existent category', async () => {
            const newName = 'New name';
            //Save category
            const addedCategory = await forecastsCategoriesController.saveCategory(testData);
            //Changing values
            addedCategory.name = newName;
            addedCategory.type = INCOME;
            //Updating category
            await forecastsCategoriesController.saveCategory(addedCategory);
            //Load all categories from database
            const categoryList = await forecastsCategories.getAllCategories();
            //Test conditions
            cExpect(categoryList).to.have.length(1);
            cExpect(categoryList[0]).to.have.property('name', newName);
            cExpect(categoryList[0]).to.have.property('type', INCOME);
        });

    });
});