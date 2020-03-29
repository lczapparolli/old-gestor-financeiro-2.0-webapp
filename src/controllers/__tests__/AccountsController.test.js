//Libs
import chai from 'chai';
import accounts from '../../db/Accounts';
import db from '../../db';
import { convertToNumber } from '../../helpers/ConvertToNumber';
//Tested module
import accountsController from '../AccountsController';
import Account, { CHECKING } from '../../models/Account';

const cExpect = chai.expect;

//Test data
const accountsData = [
    { name: 'Acc1', type: 'checking', initialValue: 10 },
    { name: 'Acc2', type: 'checking', initialValue: 20 },
    { name: 'CC1', type: 'credit', initialValue: 10 },
    { name: 'CC2', type: 'credit', initialValue: 10 },
    { name: 'Inv1', type: 'savings', initialValue: 0 },
    { name: 'Inv2', type: 'savings', initialValue: 10 }
];

describe('AccountsController', () => {

    it('is an object', () => {
        cExpect(accountsController).to.be.a('object');
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
            
            exception = await accountsController.saveAccount().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account is required');

            exception = await accountsController.saveAccount({ }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account name is required');

            exception = await accountsController.saveAccount({ name: '' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account name is required');

            exception = await accountsController.saveAccount({ name: '  ' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account name is required');

            exception = await accountsController.saveAccount({ name: 'Account 1' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account type is required');

            exception = await accountsController.saveAccount({ name: 'Account 1', type: 'invalid' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Invalid account type');
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
            cExpect(accountList[0]).to.have.property('initialValue', accountsData[0].initialValue);
            cExpect(accountList[0]).to.have.property('balance', 0);
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
            cExpect(account).to.be.an.instanceOf(Account);
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
            cExpect(account).to.be.an.instanceOf(Account);
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

    describe('Update balance action', () => {
        beforeEach(async () => {
            await db.accounts.clear();
        });

        it('has a updateBalance method', () => {
            cExpect(accountsController).to.respondsTo('updateBalance');
        });

        it('expects an accountId and a value', async () => {
            //Insert an account
            const insertedAccount = await accountsController.saveAccount({ name: 'Account test', balance: 0, type: CHECKING });
            
            let exception = await accountsController.updateBalance().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Id is required');

            exception = await accountsController.updateBalance(-1).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account must exists');

            exception = await accountsController.updateBalance(insertedAccount.id).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Amount is required');

            exception = await accountsController.updateBalance(insertedAccount.id, 0).catch(exception => exception);
            cExpect(exception).to.not.be.a('TypeError');
        });

        it('updates the balance of given account', async () => {
            //Data
            const amount = 20;
            const newAccount = new Account('Account test', CHECKING, 10);
            //Insert an account
            const { id: insertedId } = await accountsController.saveAccount(newAccount);
            //Updates the balance
            await accountsController.updateBalance(insertedId, amount);
            //Loads account
            const account = await accountsController.getById(insertedId);
            //Checks new balance
            cExpect(account).to.have.property('balance', amount);
        });

        it('updates the balance of given account even when value is a string', async () => {
            //Data
            const amount = '-20';
            const newAccount = new Account('Account test', CHECKING, 10);
            //Insert an account
            const { id: insertedId } = await accountsController.saveAccount(newAccount);
            //Updates the balance
            await accountsController.updateBalance(insertedId, amount);
            //Loads account
            const account = await accountsController.getById(insertedId);
            //Checks new balance
            cExpect(account).to.have.property('balance', convertToNumber(amount));
        });

        it('does not change when `0` is passed', async () => {
            //Data
            const amount = 0;
            const newAccount = new Account('Account test', CHECKING, 10);
            //Insert an account
            const { id: insertedId } = await accountsController.saveAccount(newAccount);
            //Updates the balance
            await accountsController.updateBalance(insertedId, amount);
            //Loads account
            const account = await accountsController.getById(insertedId);
            //Checks new balance
            cExpect(account).to.have.property('balance', 0);
        });
    });
});