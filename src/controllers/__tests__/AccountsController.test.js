//Libs
import chai from 'chai';
//Tested module
import accountsController from '../AccountsController';
import accounts from '../../db/Accounts';
import db from '../../db';

const cExpect = chai.expect;

//Test data
const accountsData = [
    { name: 'Acc1', type: 'checking', balance: 10 },
    { name: 'Acc2', type: 'checking', balance: 20 },
    { name: 'CC1', type: 'credit', balance: 10 },
    { name: 'CC2', type: 'credit', balance: 10 },
    { name: 'Inv1', type: 'savings', balance: 0 },
    { name: 'Inv2', type: 'savings', balance: 10 }
];

describe('AccountsController', () => {

    it('is an object', () => {
        cExpect(accountsController).to.be.a('object');
    });

    describe('Load accounts action', () => {
        beforeEach(() => {
            db.accounts.clear();
        });

        it('have a findAll that returns a promise', () => {
            cExpect(accountsController).to.respondsTo('findAll');
        });

        it('resolves with an object with three groups and a total. Each group have a list of accounts and a sub-total', async () => {
            const result = await accountsController.findAll();
            //Test conditions
            cExpect(result).to.have.property('total').and.be.a('number');
            cExpect(result).to.have.property('checking').and.be.an('object');
            cExpect(result).to.have.property('credit').and.be.an('object');
            cExpect(result).to.have.property('savings').and.be.an('object');
            //Testing groups
            cExpect(result).to.have.nested.property('checking.items').and.be.an('array');
            cExpect(result).to.have.nested.property('checking.sum').and.be.a('number');
            cExpect(result).to.have.nested.property('credit.items').and.be.an('array');
            cExpect(result).to.have.nested.property('credit.sum').and.be.a('number');
            cExpect(result).to.have.nested.property('savings.items').and.be.an('array');
            cExpect(result).to.have.nested.property('savings.sum').and.be.a('number');
        });

        it('returns empty arrays when no data is stored', async () => {
            const result = await accountsController.findAll();
            //Test condition
            cExpect(result).to.have.property('total', 0);
            cExpect(result).to.have.nested.property('checking.items.length', 0);
            cExpect(result).to.have.nested.property('checking.sum', 0);
            cExpect(result).to.have.nested.property('credit.items.length', 0);
            cExpect(result).to.have.nested.property('credit.sum', 0);
            cExpect(result).to.have.nested.property('savings.items.length', 0);
            cExpect(result).to.have.nested.property('savings.sum', 0);
        });

        it('returns a filled array when data is stored', async () => {
            //Insert all test data
            await Promise.all(accountsData.map(async (account) => {
                return accountsController.saveAccount(account);
            }));
            //Load data
            const result = await accountsController.findAll();
            //Test condition
            cExpect(result).to.have.property('total', 60);
            cExpect(result).to.have.nested.property('checking.items.length', 2);
            cExpect(result).to.have.nested.property('checking.sum', 30);
            cExpect(result).to.have.nested.property('credit.items.length', 2);
            cExpect(result).to.have.nested.property('credit.sum', 20);
            cExpect(result).to.have.nested.property('savings.items.length', 2);
            cExpect(result).to.have.nested.property('savings.sum', 10);
        });
    });

    describe('Add account action', () => {
        beforeEach(() => {
            db.accounts.clear();
        });

        it('have a saveAccount that returns a promise', () => {
            cExpect(accountsController).to.respondsTo('saveAccount');
        });

        it('expects an account object with a name', async () => {
            let exception;
            //TODO: Padronize exceptions with TypeError
            exception = await accountsController.saveAccount().catch(exception => exception);
            cExpect(exception).to.be.equal('Account is required');

            exception = await accountsController.saveAccount({ }).catch(exception => exception);
            cExpect(exception).to.be.equal('Account name is required');

            exception = await accountsController.saveAccount({ name: '' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Account name is required');

            exception = await accountsController.saveAccount({ name: '  ' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Account name is required');

            exception = await accountsController.saveAccount({ name: 'Account 1' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Account type is required');

            exception = await accountsController.saveAccount({ name: 'Account 1', type: 'invalid' }).catch(exception => exception);
            cExpect(exception).to.be.equal('Invalid account type');
            //TODO: Validates balance type
            //TODO: Validates name type
            //TODO: Validates duplicated error
        });
        
        it('saves the inserted account into database', async () => {
            await accountsController.saveAccount(accountsData[0]);
            const accountList = await accounts.getAllAccounts();
            cExpect(accountList).to.have.length(1);
            cExpect(accountList[0]).to.have.property('name', accountsData[0].name);
            cExpect(accountList[0]).to.have.property('type', accountsData[0].type);
            cExpect(accountList[0]).to.have.property('balance', accountsData[0].balance);
            cExpect(accountList[0]).to.have.property('id');
        });

        it('Cannot saves duplicated account', async () => {
            await accountsController.saveAccount(accountsData[0]);
            await accountsController.saveAccount(accountsData[0]).catch(exception => exception);
            //Check if its saved twice
            const accountList = await accounts.getAllAccounts();
            cExpect(accountList).to.have.length(1);
        });

        it('does not store more fields than expected', async () => {
            const accountTest = accountsData[0];
            accountTest.extraField = 'Extra value';
            await accountsController.saveAccount(accountTest);
            const accountList = await accounts.getAllAccounts();
            cExpect(accountList).to.have.length(1);
            cExpect(accountList[0]).to.not.have.property('extraField');
        });

        it('does not touch original object', async () => {
            const accountTest = accountsData[0];
            await accountsController.saveAccount(accountTest);
            cExpect(accountTest).to.not.have.property('id');
        });
    });

    describe('Get by name Action', () => {
        it('have a findByName', () => {
            cExpect(accountsController).to.respondsTo('getByName');
        });

        it('Expects an account name as parameter', async () => {
            const exception = await accountsController.getByName().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account name is required');
        });

        it('Returns null when the account does not exists', async () => {
            const account = await accountsController.getByName('Account 1');
            cExpect(account).to.be.null;
        });

        it ('Returns the account when it is found', async () => {
            const accountName = 'Account 1';
            await accountsController.saveAccount({ name: accountName, type: 'credit' });
            const account = await accountsController.getByName(accountName);
            cExpect(account).to.be.not.null;
            cExpect(account).to.have.property('id').greaterThan(0);
        });
    });

    describe('Get by id Action', () => {
        beforeEach(() => {
            db.accounts.clear();
        });

        it('have a getById function', () => {
            cExpect(accountsController).to.respondsTo('getById');
        });

        it('Expects an number as parameter', async () => {
            const exception = await accountsController.getById().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Id is required');
        });

        it('Returns null when the account does not exists', async () => {
            const account = await accountsController.getById(100);
            cExpect(account).to.be.null;
        });

        it('Returns the account when it is found', async () => {
            const insertedAccount = await accountsController.saveAccount(accountsData[0]);
            const account = await accountsController.getById(insertedAccount.id);
            cExpect(account).to.be.not.null;
            cExpect(account).to.have.property('id', insertedAccount.id);
            cExpect(account).to.have.property('name', accountsData[0].name);
        });

        it('works when the id passed is a string', async () => {
            const insertedAccount = await accountsController.saveAccount(accountsData[0]);
            const account = await accountsController.getById(insertedAccount.id.toString());
            cExpect(account).to.be.not.null;
        });
    });

    describe('List all action', () => {
        beforeEach(() => {
            db.accounts.clear();
        });

        it('has a listAll function', () => {
            cExpect(accountsController).to.respondsTo('listAll');
        });

        it('returns an array', async () => {
            const accounts = await accountsController.listAll();
            cExpect(accounts).to.be.an('array');
        });

        it('returns an empty array when no there are no accounts in DB', async () => {
            const accounts = await accountsController.listAll();
            cExpect(accounts).to.have.length(0);
        });

        it('returns an array with all accounts in DB', async() => {
            //Insert all test data
            await Promise.all(accountsData.map(async (account) => {
                return accountsController.saveAccount(account);
            }));

            const accounts = await accountsController.listAll();
            cExpect(accounts).to.have.length(accountsData.length);
        });
    });
});