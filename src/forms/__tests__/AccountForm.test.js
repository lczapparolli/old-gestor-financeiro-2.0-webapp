//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import formatNumber from '../../helpers/FormatNumber';
import { convertToNumber } from '../../helpers/ConvertToNumber';
//Tested module
import AccountForm from '../AccountForm';
import Account, { CHECKING } from '../../models/Account';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Mocked function
const onSubmit = () => {};

//Test data
const testData = {
    name: { value: 'Account 1', error: '' },
    balance: { value: '-100,01', error: '' },
    type: { value: 'credit', error: '' }
};

describe('AccountForm component', () => {
    it('has inputs for account name, initial balance and account type', () => {
        //Initializing form
        const form = shallow(<AccountForm onSubmit={onSubmit} />);
        //Conditions
        cExpect(form).to.have.descendants('form');
        cExpect(form.find('InputField[name="name"]')).to.be.present();
        cExpect(form.find('InputField[name="balance"]')).to.be.present();
        cExpect(form.find('SelectField[name="type"]')).to.be.present();
    });

    it('fills fields with props data', () => {
        const account = new Account('Account 1', 'account', 10);
        const form = shallow(<AccountForm account={account} onSubmit={onSubmit} />);

        cExpect(form.find('InputField[name="name"]')).to.have.prop('value', account.name);
        cExpect(form.find('InputField[name="balance"]')).to.be.prop('value', formatNumber(account.balance));
        cExpect(form.find('SelectField[name="type"]')).to.be.prop('value', account.type);
    });

    it('fills fields with empty data when no account is provided', () => {
        const form = shallow(<AccountForm onSubmit={onSubmit} />);

        cExpect(form.find('InputField[name="name"]')).to.have.prop('value', '');
        cExpect(form.find('InputField[name="balance"]')).to.be.prop('value', formatNumber(0));
        cExpect(form.find('SelectField[name="type"]')).to.be.prop('value', '');
    });

    it('calls onNameValidate function with account name', done => {
        const handleNameValidate = accountName => {
            cExpect(accountName).to.be.equal(testData.name.value);
            done();
        };

        const form = shallow(<AccountForm onNameValidate={handleNameValidate} onSubmit={onSubmit} />);
        
        form.setState({ name: testData.name, balance: testData.balance, type: testData.type });
        form.find('form').simulate('submit', { preventDefault() {} });
    });

    it('calls onSubmit function with account object', done => {

        const onSubmit = data => {
            cExpect(data).to.be.an.instanceOf(Account);
            cExpect(data).to.have.property('name', testData.name.value);
            cExpect(data).to.have.property('balance', convertToNumber(testData.balance.value));
            cExpect(data).to.have.property('type', testData.type.value);
            done();
        };
        //Initializing form
        const form = shallow(<AccountForm onSubmit={onSubmit} />);

        form.setState({ name: testData.name, balance: testData.balance, type: testData.type });
        form.find('form').simulate('submit', { preventDefault() {} });
    });

    it('validates type content', () => {
        //Initializing component
        const form = shallow(<AccountForm onSubmit={onSubmit} />);
        
        cExpect(form.instance().typeValidation(CHECKING)).to.be.empty;
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