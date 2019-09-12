//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import Accounts, { AccountCategory, Account } from '../Accounts';
import formatNumber from '../../helpers/FormatNumber';
import AccountModel, { CHECKING } from '../../models/Account';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const testData = {
    title: 'Category1',
    accounts: [],
    sum: 0
};

beforeAll(() => {
    //Initialize accounts
    let account1 = new AccountModel('Account 1', CHECKING, 10);
    account1.id = 1;
    account1.balance = -5;

    let account2 = new AccountModel('Account 2', CHECKING, 20);
    account2.id = 2;
    account2.balance = -10;

    testData.accounts.push(account1);
    testData.accounts.push(account2);
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
        it('Renders a title and a table with two columns', () => {
            cExpect(component).to.have.descendants('h2');
            cExpect(component).to.have.descendants('table');
            cExpect(component.find('thead > tr > th')).to.have.length(2);
        });

        it('Renders a table with three categories', () => {
            cExpect(component.find('tbody > AccountCategory')).to.have.length(3);
            cExpect(component.find('tbody > AccountCategory[title="Accounts"]')).to.have.length(1);
            cExpect(component.find('tbody > AccountCategory[title="Credit Cards"]')).to.have.length(1);
            cExpect(component.find('tbody > AccountCategory[title="Investments"]')).to.have.length(1);
        });

        it('Renders a row with a total', () => {
            cExpect(component).to.have.descendants('tfoot');
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
        component = shallow(<AccountCategory title={testData.title} accounts={testData.accounts} sum={testData.sum}  />);
    });

    describe('Component structure', () => {
        it('Renders a header and a subtotal rows', () => {
            cExpect(component.find('tr.CategoryHeader')).to.have.length(1);
            cExpect(component.find('tr.CategoryTotal')).to.have.length(1);
        });

        it('Renders an Account component for each account', () => {
            cExpect(component.find('Account')).to.have.length(testData.accounts.length);
            cExpect(component.find('Account').first()).to.have.prop('account', testData.accounts[0]);
        });

        it('Renders the total', () => {
            cExpect(component.find('tr.CategoryTotal > .NumberField')).to.have.text(formatNumber(testData.sum, 'R$'));
        })
    });
});

describe('Account component', () => {
    let component;
    beforeAll(() => {
        //Initializing component
        component = shallow(<Account account={testData.accounts[0]} />);
    });

    describe('Component structure', () => {
        it('Renders two coluns', () =>{
            cExpect(component).to.have.descendants('tr');
            cExpect(component.find('td')).to.have.length(2);
        });

        it('Shows the initialValue + balance', () => {
            let balance = testData.accounts[0].initialValue + testData.accounts[0].balance;
            cExpect(component.find('.NumberField')).to.have.text(formatNumber(balance, 'R$'));
        });

        it('Renders a Link with account name', () => {
            const linkComponent = component.find('Link');
            cExpect(linkComponent).to.exist;
            cExpect(linkComponent).to.contain(testData.accounts[0].name);
            cExpect(linkComponent).to.have.prop('to', '/accounts/' + testData.accounts[0].id);
        });
    });
});
