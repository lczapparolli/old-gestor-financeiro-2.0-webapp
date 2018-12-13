import loginEndpoint from '../api/LoginEndpoint';
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
            return { logged: true, error: '' };
        } catch (error) {
            return { logged: false, error: 'Invalid user name' };
        }
    }

    logout() {

    }
}

export default new LoginController();