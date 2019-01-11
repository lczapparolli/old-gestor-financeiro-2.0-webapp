//Libs
import chai from 'chai';
//Tested module
import accountsController from '../AccountsController';

const cExpect = chai.expect;

describe('AccountsController', () => {
    it('is an object', () => {
        cExpect(accountsController).to.be.a('object');
    });

    describe('Load accounts action', () => {
        it('have a findAll that returns a promise', () => {
            cExpect(accountsController).to.respondsTo('findAll');
            cExpect(accountsController.findAll()).to.be.a('Promise');
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
    });

    describe('Add account action', () => {
        it('have a addAccount that returns a promise', () => {
            cExpect(accountsController).to.respondsTo('addAccount');
            cExpect(accountsController.addAccount()).to.be.a('Promise');
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
        
        it('saves the inserted account into database', () => {
            chai.assert.fail('', '', 'Not implemented');
        });
    });
});