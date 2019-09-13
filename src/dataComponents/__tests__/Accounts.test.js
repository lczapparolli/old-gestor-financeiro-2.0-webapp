//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import Accounts, { AccountCategory, Account } from '../Accounts';
import formatNumber from '../../helpers/FormatNumber';
import AccountModel, { CHECKING } from '../../models/Account';
import db from '../../db';
import AccountsController from '../../controllers/AccountsController';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const testData = {
    title: 'Category1',
    items: [],
    sum: 0,
    initialSum: 0
};

beforeAll(async () => {
    await db.accounts.clear();
    //Initialize accounts
    let account1 = new AccountModel('Account 1', CHECKING, 10);
    account1 = await AccountsController.saveAccount(account1);
    await AccountsController.updateBalance(account1.id, -5);

    let account2 = new AccountModel('Account 2', CHECKING, 20);
    account2 = await AccountsController.saveAccount(account2);
    await AccountsController.updateBalance(account2.id, -10);

    testData.items.push(account1);
    testData.items.push(account2);
    testData.initialSum = 30;
    testData.sum = 15;
});

describe('Accounts component', () => {
    let component;
    beforeAll(async () => {
        //Initializing component
        component = shallow(<Accounts />);
        //Wait component to be fully mounted
        await component.instance().componentDidMount();
    });

    describe('Component structure', () => {
        it('Renders a title and a table with three columns', () => {
            cExpect(component).to.have.descendants('h2');
            cExpect(component).to.have.descendants('table');
            cExpect(component.find('thead > tr > th')).to.have.length(3);
        });

        it('Renders a table with three categories', () => {
            cExpect(component.find('tbody > AccountCategory')).to.have.length(3);
            cExpect(component.find('tbody > AccountCategory[title="Accounts"]')).to.have.length(1);
            cExpect(component.find('tbody > AccountCategory[title="Credit Cards"]')).to.have.length(1);
            cExpect(component.find('tbody > AccountCategory[title="Investments"]')).to.have.length(1);
        });

        it('Renders a row with a total', () => {
            cExpect(component).to.have.descendants('tfoot');
            cExpect(component.find('tfoot > tr > .NumberField')).to.have.length(2);
            cExpect(component.find('tfoot > tr > .NumberField').at(0)).to.have.text(formatNumber(testData.initialSum, 'R$'));
            cExpect(component.find('tfoot > tr > .NumberField').at(1)).to.have.text(formatNumber(testData.sum, 'R$'));
        });

        it('Has a Link to add a new account', () => {
            cExpect(component.find('Link')).to.have.prop('to', '/accounts/new');
        });
    });
});

describe('AccountCategory component', () => {
    let component;
    beforeAll(() => {
        //Initializing component
        component = shallow(<AccountCategory title={testData.title} group={testData}  />);
    });

    describe('Component structure', () => {
        it('Renders a header and a subtotal rows', () => {
            cExpect(component.find('tr.CategoryHeader')).to.have.length(1);
            cExpect(component.find('tr.CategoryTotal')).to.have.length(1);
        });

        it('Renders an Account component for each account', () => {
            cExpect(component.find('Account')).to.have.length(testData.items.length);
            cExpect(component.find('Account').first()).to.have.prop('account', testData.items[0]);
        });

        it('Renders the total', () => {
            cExpect(component.find('tr.CategoryTotal > .NumberField')).to.have.length(2);
            cExpect(component.find('tr.CategoryTotal > .NumberField').at(0)).to.have.text(formatNumber(testData.initialSum, 'R$'));
            cExpect(component.find('tr.CategoryTotal > .NumberField').at(1)).to.have.text(formatNumber(testData.sum, 'R$'));
        })
    });
});

describe('Account component', () => {
    let component;
    beforeAll(() => {
        //Initializing component
        component = shallow(<Account account={testData.items[0]} />);
    });

    describe('Component structure', () => {
        it('Renders three coluns', () =>{
            cExpect(component).to.have.descendants('tr');
            cExpect(component.find('td')).to.have.length(3);
        });

        it('Shows the initialValue + balance', () => {
            let balance = testData.items[0].initialValue + testData.items[0].balance;
            cExpect(component.find('.NumberField').at(0)).to.have.text(formatNumber(testData.items[0].initialValue, 'R$'));
            cExpect(component.find('.NumberField').at(1)).to.have.text(formatNumber(balance, 'R$'));
        });

        it('Renders a Link with account name', () => {
            const linkComponent = component.find('Link');
            cExpect(linkComponent).to.exist;
            cExpect(linkComponent).to.contain(testData.items[0].name);
            cExpect(linkComponent).to.have.prop('to', '/accounts/' + testData.items[0].id);
        });
    });
});
