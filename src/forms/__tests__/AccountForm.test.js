//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import AccountForm from '../AccountForm';
import accountsController, { ACCOUNT } from '../../controllers/AccountsController';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Mocked function
const onSubmit = () => {};

describe('AccountForm component', () => {
    it('have inputs for account name, initial balance and account type', () => {
        //Initializing form
        const form = shallow(<AccountForm />);
        //Conditions
        cExpect(form).to.have.descendants('form');
        cExpect(form.find('InputField[name="name"]')).to.be.present();
        cExpect(form.find('InputField[name="balance"]')).to.be.present();
        cExpect(form.find('InputField[name="type"]')).to.be.present();
    });

    it('calls onSubmit function with account data', done => {
        //Test data
        const name = { value: 'Account 1', error: '' };
        const balance = { value: '-100,01', error: '' };
        const type = { value: 'cc', error: '' };

        const onSubmit = data => {
            cExpect(data).to.have.property('name', name.value);
            cExpect(data).to.have.property('balance', -100.01);
            cExpect(data).to.have.property('type', type.value);
            done();
        };
        //Initializing form
        const form = shallow(<AccountForm onSubmit={onSubmit} />);

        form.setState({ name, balance, type });
        form.find('form').simulate('submit', { preventDefault() {} });
    });

    it('validates name uniqueness', async () => {
        const accountData = { name: 'Account 1', balance: 0, type: 'cc' };
        //Setting up database
        await accountsController.addAccount(accountData);

        //Initializing form
        const form = shallow(<AccountForm onSubmit={onSubmit} />);
        //Set form state
        form.setState({
            name: { value: accountData.name, error: '' },
            balance: { value: accountData.balance, error: '' },
            type: { value: accountData.type, error: '' }
        });
        //Simulates the submit
        await form.instance().handleSubmit({ preventDefault() {} });
        cExpect(form.state()).to.have.nested.property('name.error').not.empty;
    });

    it('validates type content', () => {
        //Initializing component
        const form = shallow(<AccountForm onSubmit={onSubmit} />);
        
        cExpect(form.instance().typeValidation(ACCOUNT)).to.be.empty;
        cExpect(form.instance().typeValidation('Invalid type')).to.be.not.empty;
    });

    it('validates balance value', () => {
        //Initializing component
        const form = shallow(<AccountForm onSubmit={onSubmit} />);

        //Valid values
        cExpect(form.instance().balanceValidation('')).to.be.empty;
        cExpect(form.instance().balanceValidation('1')).to.be.empty;
        cExpect(form.instance().balanceValidation('0,1')).to.be.empty;
        cExpect(form.instance().balanceValidation('0,01')).to.be.empty;
        cExpect(form.instance().balanceValidation('-0,01')).to.be.empty;
        cExpect(form.instance().balanceValidation('-0,1')).to.be.empty;
        cExpect(form.instance().balanceValidation('-1')).to.be.empty;
        cExpect(form.instance().balanceValidation('1.000')).to.be.empty;
        cExpect(form.instance().balanceValidation('-1.000')).to.be.empty;
        cExpect(form.instance().balanceValidation('1.000,00')).to.be.empty;
        cExpect(form.instance().balanceValidation('-1.000,00')).to.be.empty;
        //Invalid values
        cExpect(form.instance().balanceValidation('invalid value')).to.be.not.empty;
        cExpect(form.instance().balanceValidation('1,000.00')).to.be.not.empty;
        cExpect(form.instance().balanceValidation('1.1.1')).to.be.not.empty;
    });
});