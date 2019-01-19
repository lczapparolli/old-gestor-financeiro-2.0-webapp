//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow, mount } from 'enzyme';
//Tested module
import AccountForm from '../AccountForm';
import accountsController from '../../controllers/AccountsController';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

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
        const balance = { value: '100,00', error: '' };
        const type = { value: 'cc', error: '' };

        const onSubmit = data => {
            cExpect(data).to.have.property('name', name.value);
            cExpect(data).to.have.property('balance', balance.value);
            cExpect(data).to.have.property('type', type.value);
            done();
        };
        //Initializing form
        const form = mount(<AccountForm onSubmit={onSubmit} />);

        form.setState({ name, balance, type });
        form.find('form').simulate('submit');
    });

    it('validates name uniqueness', async () => {
        const accountData = { name: 'Account 1', balance: 0, type: 'cc' };
        //Setting up database
        await accountsController.addAccount(accountData);

        //Mocked function
        const onSubmit = () => {};
        //Initializing form
        const form = mount(<AccountForm onSubmit={onSubmit} />);
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
});