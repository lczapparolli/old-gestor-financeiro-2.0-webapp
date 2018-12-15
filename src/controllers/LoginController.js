import loginEndpoint from '../api/LoginEndpoint';
import config from '../db/Config';
/**
 * Controls the authentication logic and state
 */
class LoginController {
    constructor() {
        this.endpoint = loginEndpoint;
    }

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

    logout() {

    }
}

export default new LoginController();