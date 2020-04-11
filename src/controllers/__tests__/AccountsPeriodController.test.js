//Libs
import chai from 'chai';
import db from '../../db';
import formatPeriod from '../../helpers/FormatPeriod';
//Tested module
import AccountPeriod from '../../models/AccountPeriod';
import accountsController from '../AccountsController';
import accountsPeriodController from '../AccountsPeriodController';
import GroupedAccounts from '../../models/GroupedAccounts';
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

let testAccount;


describe('AccountsPeriodController', () => {
    beforeEach(async () => {
        await db.accounts.clear();
        await db.accounts_period.clear();

        testAccount = await accountsController.saveAccount(new Account('Account test', CHECKING, 10));
    });

    describe('Save accountPeriod action', () => {
        it('has a saveAccountPeriod method', () => {
            cExpect(accountsPeriodController).to.respondsTo('saveAccountPeriod');
        });

        it('expects a accountPeriod with an accountId, a period and a balance', async () => {
            let exception;

            exception = await accountsPeriodController.saveAccountPeriod().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'AccountPeriod is required');

            exception = await accountsPeriodController.saveAccountPeriod({}).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account id is required');
            exception = await accountsPeriodController.saveAccountPeriod({ accountId: '' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account id is required');
            exception = await accountsPeriodController.saveAccountPeriod({ accountId: 0 }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account id is required');
            exception = await accountsPeriodController.saveAccountPeriod({ accountId: 'invalid' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account id must be a number');
            exception = await accountsPeriodController.saveAccountPeriod({ accountId: 99 }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Account must exists');

            exception = await accountsPeriodController.saveAccountPeriod({ accountId: testAccount.id }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Period is required');
            exception = await accountsPeriodController.saveAccountPeriod({ accountId: testAccount.id, period: '' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Period is required');
            exception = await accountsPeriodController.saveAccountPeriod({ accountId: testAccount.id, period: 'invalid' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Period must be a number');
            //Period can be explicity 0

            exception = await accountsPeriodController.saveAccountPeriod({ accountId: testAccount.id, period: 0 }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Balance is required');
            exception = await accountsPeriodController.saveAccountPeriod({ accountId: testAccount.id, period: 0, balance: '' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Balance is required');
            exception = await accountsPeriodController.saveAccountPeriod({ accountId: testAccount.id, period: 0, balance: 'invalid' }).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Balance must be a number');
            //Balance can be explicity 0

        });

        it('inserts a new record in accountPeriod table', async () => {
            //Test data
            const accountPeriod = new AccountPeriod(testAccount.id, formatPeriod(3, 2020), 33.6);

            //Account inserts a record with period 0
            let accountsPeriod = await db.accounts_period.toArray();
            cExpect(accountsPeriod).to.have.length(1);
            cExpect(accountsPeriod[0]).to.have.property('period', 0);

            //Insert into database
            const inserted = await accountsPeriodController.saveAccountPeriod(accountPeriod);

            //Returned have the same fields + id
            cExpect(inserted).to.have.property('id').greaterThan(0);
            cExpect(inserted).to.have.property('accountId', accountPeriod.accountId);
            cExpect(inserted).to.have.property('period', accountPeriod.period);
            cExpect(inserted).to.have.property('balance', accountPeriod.balance);
            //Should not touch original object
            cExpect(accountPeriod).to.not.have.property('id');
           
            //Check if the record is inserted
            accountsPeriod = await db.accounts_period.where('period').above(0).toArray();
            cExpect(accountsPeriod).to.have.length(1);
            cExpect(accountsPeriod[0]).to.have.property('period', accountPeriod.period);
        });

        it('does not store more fields than expected', async () => {
            //Test data
            const accountPeriod = new AccountPeriod(testAccount.id, formatPeriod(3, 2020), 33.6);
            accountPeriod.newField = 'Test';
            //Insert into database
            await accountsPeriodController.saveAccountPeriod(accountPeriod);
           
            //Check if the record is inserted
            const accountsPeriod = await db.accounts_period.where('period').above(0).toArray();
            cExpect(accountsPeriod).to.have.length(1);
            cExpect(accountsPeriod[0]).to.not.have.property('newField');
        });

        it('updates the data when a record with the same accountId and period already exists', async () => {
            
            //Test data
            const accountPeriod = new AccountPeriod(testAccount.id, formatPeriod(3, 2020), 33.6);
            const newBalance = 55.8;
            //Insert into database
            const inserted = await accountsPeriodController.saveAccountPeriod(accountPeriod);

            //Changing data
            inserted.balance = newBalance;
            await accountsPeriodController.saveAccountPeriod(inserted);

            //Check if the record was updated
            const accountsPeriod = await db.accounts_period.where('period').above(0).toArray();
            cExpect(accountsPeriod).to.have.length(1);
            cExpect(accountsPeriod[0]).to.have.property('balance', newBalance);
        });

        it('should update the accountPeriod by accountId and period', async () => {
            //Test data
            const period = formatPeriod(3, 2020);
            //Inserting account period
            const { id : insertedId } = await accountsPeriodController.saveAccountPeriod(new AccountPeriod(testAccount.id, period, 0));
            //Inserting account period with same parameters
            const newAccountPeriod = await accountsPeriodController.saveAccountPeriod(new AccountPeriod(testAccount.id, period, 0));

            //Should return the same id
            cExpect(newAccountPeriod).to.have.property('id', insertedId);
        });

        it('validates if an accountPeriod tries to change accountId or period and it already exists', async () => {
            //Test data
            const period = formatPeriod(3, 2020);
            const accountPeriod = new AccountPeriod(testAccount.id, period, 0);
            //Inserting account period
            const { id : insertedId } = await accountsPeriodController.saveAccountPeriod(accountPeriod);
            //Forcing an id
            accountPeriod.id = insertedId + 1;
            //Inserting account period with same parameters
            const exception = await accountsPeriodController.saveAccountPeriod(accountPeriod).catch(exception => exception);

            //Should return the same id
            cExpect(exception).to.have.property('message', 'Account/period pair already exists');
        });
    });

    describe('Update balance Action', () => {

        it('has a updateBalance method', () => {
            cExpect(accountsPeriodController).to.respondsTo('updateBalance');
        });

        it('expects an accountId, a period and a value', async () => {
            throw 'Not implemented';
        });

        it('inserts a new record in AccountPeriod model when it does not exists', () => {
            throw 'Not implemented';
        });

        it('updates de balance of an AccountPeriod model when it already exists', () => {
            throw 'Not implemented';
        });

        it('updates the initialBalance of the account in the next period', () => {
            throw 'Not implemented';
        });
    });

    describe('Get all accounts by period action', () => {
        beforeEach(async () => {
            for (var account of accountsData) {
                await accountsController.saveAccount(account);
            }
        });

        it('has a getByPeriod function', () => {
            cExpect(accountsPeriodController).to.respondsTo('getByPeriod');
        });

        it('expects a period as parameter', async () => {
            let exception;
            exception = await accountsPeriodController.getByPeriod().catch(exception => exception);

            cExpect(exception).to.have.property('message', 'Period is required');
        });

        it('returns a list of accounts grouped by category', async () => {
            const period = formatPeriod(12, 2019);
            //Getting accounts
            const accounts = await accountsPeriodController.getByPeriod(period);
            //Test conditions
            cExpect(accounts).to.be.an.instanceOf(GroupedAccounts);
            cExpect(accounts).to.have.property('total').equal(60);
            cExpect(accounts).to.have.property('checking').and.be.an('object');
            cExpect(accounts).to.have.property('credit').and.be.an('object');
            cExpect(accounts).to.have.property('savings').and.be.an('object');

            cExpect(accounts.checking).to.have.property('items').and.be.an('array');
            cExpect(accounts.checking.items).to.have.length(2);

            cExpect(accounts.credit).to.have.property('items').and.be.an('array');
            cExpect(accounts.credit.items).to.have.length(2);

            cExpect(accounts.savings).to.have.property('items').and.be.an('array');
            cExpect(accounts.savings.items).to.have.length(2);
        });

    });

    describe('Get by id and period Action', () => {
        it('have a getByIdPeriod function', () => {
            cExpect(accountsPeriodController).to.respondsTo('getByIdPeriod');
        });

        it('expects an id and a period as parameter', async () => {
            let exception = await accountsPeriodController.getByIdPeriod().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Id is required');

            exception = await accountsPeriodController.getByIdPeriod(1).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Period is required');

            exception = await accountsPeriodController.getByIdPeriod(1, 'invalid').catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Period must be a number');
            
            //accept period as explicit 0
            exception = await accountsPeriodController.getByIdPeriod(1, 0).catch(exception => exception);
            cExpect(exception).to.be.null;
        });

        it('returns `null` when accountPeriod is not found', async () => {
            const period = formatPeriod(12, 2019);
            const accountPeriod = await accountsPeriodController.getByIdPeriod(testAccount.id, period);

            cExpect(accountPeriod).to.be.null;
        });

        it('returns the AccountPeriod with balance equals to the initial account balance', async () => {
            const period = formatPeriod(12, 2019);
            const balance = 22.3;
            await accountsPeriodController.saveAccountPeriod(new AccountPeriod(testAccount.id, period, balance));
            const accountPeriod = await accountsPeriodController.getByIdPeriod(testAccount.id, period);

            cExpect(accountPeriod).to.be.not.null;
            cExpect(accountPeriod).to.be.an.instanceOf(AccountPeriod);
            cExpect(accountPeriod).to.have.property('id').greaterThan(0);
            cExpect(accountPeriod).to.have.property('accountId', testAccount.id);
            cExpect(accountPeriod).to.have.property('balance', balance);
            cExpect(accountPeriod).to.have.property('period', period);
        });
    });

});