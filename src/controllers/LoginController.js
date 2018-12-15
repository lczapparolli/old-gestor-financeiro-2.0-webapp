import loginEndpoint from '../api/LoginEndpoint';
import config from '../db/Config';
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
            await this.endpoint.login(email, password);
            await config.setLogged(true);
            return { logged: true, error: '' };
        } catch (error) {
            await config.setLogged(false);
            return { logged: false, error: 'Invalid user name' };
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

    logout() {
        return config.setLogged(false);
    }
}

export default new LoginController();