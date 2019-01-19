//Libs
import chai from 'chai';
//Tested module
import accountsController from '../AccountsController';
import accounts from '../../db/Accounts';
import db from '../../db';

const cExpect = chai.expect;

//Test data
const accountsData = [
    { name: 'Acc1', type: 'account', balance: 10 },
    { name: 'Acc2', type: 'account', balance: 20 },
    { name: 'CC1', type: 'cc', balance: 10 },
    { name: 'CC2', type: 'cc', balance: 10 },
    { name: 'Inv1', type: 'invest', balance: 0 },
    { name: 'Inv2', type: 'invest', balance: 10 }
];

describe('AccountsController', () => {
    beforeEach(() => {
        db.accounts.clear();
    });

    it('is an object', () => {
        cExpect(accountsController).to.be.a('object');
    });

    describe('Load accounts action', () => {
        it('have a findAll that returns a promise', () => {
            cExpect(accountsController).to.respondsTo('findAll');
        });

        it('resolves with an object with three groups and a total. Each group have a list of accounts and a sub-total', async () => {
            const result = await accountsController.findAll();
            //Test conditions
            cExpect(result).to.have.property('total').and.be.a('number');
            cExpect(result).to.have.property('account').and.be.an('object');
            cExpect(result).to.have.property('cc').and.be.an('object');
            cExpect(result).to.have.property('invest').and.be.an('object');
            //Testing groups
            cExpect(result).to.have.nested.property('account.items').and.be.an('array');
            cExpect(result).to.have.nested.property('account.sum').and.be.a('number');
            cExpect(result).to.have.nested.property('cc.items').and.be.an('array');
            cExpect(result).to.have.nested.property('cc.sum').and.be.a('number');
            cExpect(result).to.have.nested.property('invest.items').and.be.an('array');
            cExpect(result).to.have.nested.property('invest.sum').and.be.a('number');
        });

        it('returns empty arrays when no data is stored', async () => {
            const result = await accountsController.findAll();
            //Test condition
            cExpect(result).to.have.property('total', 0);
            cExpect(result).to.have.nested.property('account.items.length', 0);
            cExpect(result).to.have.nested.property('account.sum', 0);
            cExpect(result).to.have.nested.property('cc.items.length', 0);
            cExpect(result).to.have.nested.property('cc.sum', 0);
            cExpect(result).to.have.nested.property('invest.items.length', 0);
            cExpect(result).to.have.nested.property('invest.sum', 0);
        });

        it('returns a filled array when data is stored', async () => {
            //Insert all test data
            await Promise.all(accountsData.map(async (account) => {
                return accountsController.addAccount(account);
            }));
            //Load data
            const result = await accountsController.findAll();
            //Test condition
            cExpect(result).to.have.property('total', 60);
            cExpect(result).to.have.nested.property('account.items.length', 2);
            cExpect(result).to.have.nested.property('account.sum', 30);
            cExpect(result).to.have.nested.property('cc.items.length', 2);
            cExpect(result).to.have.nested.property('cc.sum', 20);
            cExpect(result).to.have.nested.property('invest.items.length', 2);
            cExpect(result).to.have.nested.property('invest.sum', 10);
        });
    });

    describe('Add account action', () => {
        it('have a addAccount that returns a promise', () => {
            cExpect(accountsController).to.respondsTo('addAccount');
        });

        it('expects an account object with a name', async () => {
            let exception;

            exception = await accountsController.addAccount().catch(exception => exception);
            cExpect(exception).to.be.equal('Account is required');

            exception = await accountsController.addAccount({ }).catch(exception => exception);
            cExpect(exception).to.be.equal('Account name is required');

            exception = await accountsController.addAccount({ name: '' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Account name is required');

            exception = await accountsController.addAccount({ name: '  ' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Account name is required');

            exception = await accountsController.addAccount({ name: 'Account 1' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Account type is required');

            exception = await accountsController.addAccount({ name: 'Account 1', type: 'invalid' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Invalid account type');
        });
        
        it('saves the inserted account into database', async () => {
            await accountsController.addAccount(accountsData[0]);
            const accountList = await accounts.getAllAccounts();
            cExpect(accountList).to.have.length(1);
            cExpect(accountList[0]).to.have.property('name', accountsData[0].name);
            cExpect(accountList[0]).to.have.property('type', accountsData[0].type);
            cExpect(accountList[0]).to.have.property('balance', accountsData[0].balance);
            cExpect(accountList[0]).to.have.property('id');
        });

        it('Cannot saves duplicated account', async () => {
            await accountsController.addAccount(accountsData[0]);
            await accountsController.addAccount(accountsData[0]);
            //Check if its saved twice
            const accountList = await accounts.getAllAccounts();
            cExpect(accountList).to.have.length(1);
        });
    });

    describe('Find by name Action', () => {
        it('have a findByName', () => {
            cExpect(accountsController).to.respondsTo('findByName');
        });

        it('Expects an account name as parameter', async () => {
            const exception = await accountsController.findByName().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account name is required');
        });

        it('Returns null when the account does not exists', async () => {
            const account = await accountsController.findByName('Account 1');
            cExpect(account).to.be.null;
        });

        it ('Returns the account when it is found', async () => {
            const accountName = 'Account 1';
            await accountsController.addAccount({ name: accountName, type: 'cc' });
            const account = await accountsController.findByName(accountName);
            cExpect(account).to.be.not.null;
            cExpect(account).to.have.property('id').greaterThan(0);
        });
    });
});