//Libs
import chai from 'chai';
import db from '../../db';
import formatPeriod from '../../helpers/FormatPeriod';
//Tested module
import AccountPeriod from '../../models/AccountPeriod';
import accountsController from '../AccountsController';
import accountsPeriodController from '../AccountsPeriodController';
import GroupedAccounts from '../../models/GroupedAccounts';

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


describe('AccountsPeriodController', () => {
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
            const accounts = await accountsPeriodController.getByPeriod(period);
            cExpect(accounts).to.be.an.instanceOf(GroupedAccounts);

            throw 'Not finished';
        });

    });

    describe('Get by id and period Action', () => {
        beforeEach(() => {
            db.accounts.clear();
            db.accounts_periods.clear();
        });

        it('have a getByIdPeriod function', () => {
            cExpect(accountsPeriodController).to.respondsTo('getByIdPeriod');
        });

        it('Expects an id and a period as parameter', async () => {
            let exception = await accountsPeriodController.getByIdPeriod().catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Id is required');

            exception = await accountsPeriodController.getByIdPeriod(1).catch(exception => exception);
            cExpect(exception).to.have.property('message', 'Period is required');
        });

        it('Returns the AccountPeriod with balance equals to the initial account balance', async () => {
            const insertedAccount = await accountsController.saveAccount(accountsData[0]);
            const period = formatPeriod(12, 2019);
            const accountPeriod = await accountsPeriodController.getByIdPeriod(insertedAccount.id, period);
            cExpect(accountPeriod).to.be.not.null;
            cExpect(accountPeriod).to.be.an.instanceOf(AccountPeriod);
            cExpect(accountPeriod).to.not.have.property('id');
            cExpect(accountPeriod).to.have.property('accountId', insertedAccount.id);
            cExpect(accountPeriod).to.have.property('initialBalance', accountsData[0].initialValue);
            cExpect(accountPeriod).to.have.property('balance', accountsData[0].initialValue);
        });

        it('Returns the initial balance of the previous period when it exists', () => {
            throw 'Not implemented';
        });

        it('changes initial and final value when previous period change its final balance', () => {
            throw 'Not implemented';
        });

        it('changes initial and final value when account initial value changes', () => {
            throw 'Not implemented';
        });
    });

});