import loginEndpoint from '../api/LoginEndpoint';
import config from '../db/Config';

const storeLoginData = Symbol('storeLoginData');

/**
 * Controls the authentication logic and state
 */
class LoginController {
    constructor() {
        this.endpoint = loginEndpoint;
    }

    /**
     * Send user credentials to API and store if user is logged or not
     * @param {string} email User email
     * @param {string} password User password
     */
    async login(email, password) {
        try {
            const result = await this.endpoint.login(email, password);
            if (result.token)
                await this[storeLoginData](true, result.token);
            return { logged: true, error: '' };
        } catch (error) {
            await config.setLogged(false);
            return { logged: false, error: 'Invalid email or password' };
        }
    }

    /**
     * Returns a Promise, the resolve function will return a boolean indicating if user is logged
     */
    isLogged() {
        return config.getLogged().then(logged => {
            return logged || false; //If value is not defined
        });
    }

    async logout() {
        await this[storeLoginData](false, null);
        return { logged: false };
    }

    //Private methods ---------------------------------------//
    [storeLoginData](logged, token) {
        return Promise.all([
            config.setLogged(logged),
            config.setToken(token)
        ]);
    }
}

export default new LoginController();