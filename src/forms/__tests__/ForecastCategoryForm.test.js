//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import ForecastCategoryForm from '../ForecastCategoryForm';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const testData = {
    name: 'New category name'
};
//Mock function
function emptySubmit() {}

describe('ForecastCategoryForm component', () => {
    it('has a form with fields for category name', () => {
        //Initializing component
        const form = shallow(<ForecastCategoryForm onSubmit={emptySubmit} />);
        //Test conditions
        cExpect(form).to.have.tagName('form');
        cExpect(form.find('InputField[name="name"]')).to.be.present();
        cExpect(form.find('InputField[name="name"]')).to.have.prop('required');
    });

    it('fills field with empty data when no category is provided', () => {
        //Initializing component
        const form = shallow(<ForecastCategoryForm onSubmit={emptySubmit} />);
        //Test conditions
        cExpect(form.find('InputField[name="name"]')).to.have.prop('value', '');
    });

    it('fills field with category name when data is provided', () => {
        //Test data
        const category = {
            name: 'Category test'
        };
        //Initializing component
        const form = shallow(<ForecastCategoryForm onSubmit={emptySubmit} category={category} />);
        //Test conditions
        cExpect(form.find('InputField[name="name"]')).to.have.prop('value', category.name);
    });

    it('calls onSubmit function with category data', done => {
        //Mock function
        const handleSubmit = category => {
            //Test conditions
            cExpect(category).to.have.property('name', testData.name);
            done();
        };
        //Initializing component
        const form = shallow(<ForecastCategoryForm onSubmit={handleSubmit} />);
        //Setting data
        form.setState({ name: { value: testData.name, error: '' } });
        form.find('form').simulate('submit', { preventDefault() {} });
    });

    it('calls onNameValidation function with category data', done => {
        const handleNameValidation = categoryName => {
            cExpect(categoryName).to.be.equal(testData.name);
            done();
        };
        
        //Initializing component
        const form = shallow(<ForecastCategoryForm onSubmit={emptySubmit} onNameValidation={handleNameValidation} />);
        //Setting data
        form.setState({ name: { value: testData.name, error: '' } });
        form.find('form').simulate('submit', { preventDefault() {} });
    });
});