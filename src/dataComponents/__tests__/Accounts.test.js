//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import Accounts, { AccountCategory, Account } from '../Accounts';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
const testData = {
    title: 'Category1',
    accounts: [
        { id:1, name: 'Account 1', balance: 0 },
        { id:2, name: 'Account 2', balance: 0 }
    ],
    sum: 0
};

describe('Accounts component', () => {
    let component;
    beforeAll(() => {
        //Initializing component
        component = shallow(<Accounts />);
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
            cExpect(component.find('tr.AccountCategoryHeader')).to.have.length(1);
            cExpect(component.find('tr.AccountCategoryTotal')).to.have.length(1);
        });

        it('Renders an Account component for each account', () => {
            cExpect(component.find('Account')).to.have.length(testData.accounts.length);
            cExpect(component.find('Account').first()).to.have.prop('account', testData.accounts[0]);
        });
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

        it('Renders a Link with account name', () => {
            cExpect(component.find('Link')).to.exist;
            cExpect(component.find('Link')).to.contain(testData.accounts[0].name);

        });
    });
});