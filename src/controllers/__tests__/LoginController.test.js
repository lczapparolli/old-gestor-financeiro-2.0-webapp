//Libs
import chai from 'chai';
//Test module
import loginController from '../LoginController';
import config from '../../db/Config';
import db from '../../db';

const cExpect = chai.expect;

//Test data
const testData = {
    email: 'email@email.com',
    password: 'pass123'
};

//Mocked API endpoint
const mockEndpoint = {
    login(email, password) {
        if (email === testData.email && password === testData.password)
            return Promise.resolve({ token: '' });
        else
            return Promise.reject('Bad request');
    }
};

beforeAll(() => {
    //Use mocked endpoint
    loginController.endpoint = mockEndpoint;
});

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
            const isLogged = await config.getLogged();
            cExpect(result).to.have.property('logged', true);
            cExpect(isLogged).to.be.equal(true);
        });

        it('rejects when invalid credentials are provided', async () => {
            const result = await loginController.login('invalid@email.com', testData.password);
            const isLogged = await config.getLogged();
            cExpect(result).to.have.property('error').not.empty;
            cExpect(isLogged).to.be.equal(false);
        });
    });

    describe('Logout action', () => {
        it('have a logout method that returns a Promise', () => {
            cExpect(loginController).to.respondTo('logout');
            cExpect(loginController.logout()).to.be.a('Promise');
        });
    });

    describe('isLogged action', () => {
        it('have a isLogged method that returns a Promise', () => {
            cExpect(loginController).to.respondTo('isLogged');
            cExpect(loginController.isLogged()).to.be.a('Promise');
        });

        it('returns `true` after user login', async () => {
            await loginController.login(testData.email, testData.password);
            const isLogged = await loginController.isLogged();
            cExpect(isLogged).to.be.true;
        });

        it('returns `false` after user logout', async () => {
            //Make sure the logged is true
            await config.setLogged(true);
            await loginController.logout();
            const isLogged = await loginController.isLogged();
            cExpect(isLogged).to.be.false;
        });

        it('returns `false` when no data is stored', async () => {
            await db.config.clear();
            const isLogged = await loginController.isLogged();
            cExpect(isLogged).to.be.false;
        });

    });
});