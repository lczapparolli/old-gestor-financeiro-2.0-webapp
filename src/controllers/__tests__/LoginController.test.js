//Libs
import chai from 'chai';
//Test module
import loginController from '../LoginController';

const cExpect = chai.expect;

const testData = {
    email: 'email@email.com',
    password: 'pass123'
};


describe('LoginController', () => {
    it('is an object', () => {
        cExpect(loginController).to.be.an('object');
    });

    describe('Login action', () => {
        it('have a login method that returns a promise', () => {
            cExpect(loginController).to.respondTo('login');
            cExpect(loginController.login()).to.be.a('Promise');
        });

        it('resolves when valid credentials are provided', async () => {
            const result = await loginController.login(testData.email, testData.password);
            cExpect(result).to.have.property('logged', true);
        });

        it('rejects when invalid credentials are provided', async () => {
            try {
                await loginController.login('invalid@email.com', testData.password);
                chai.assert.fail('Should throw an error');
            } catch (error) {
                cExpect(error).to.have.property('error').not.empty;
            }
        });
    });

    describe('Logout action', () => {
        it('have a logout method', () => {
            cExpect(loginController).to.respondTo('logout');
        });
    });

});