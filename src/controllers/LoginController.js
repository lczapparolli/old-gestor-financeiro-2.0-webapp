/**
 * Controls the authentication logic and state
 */
class LoginController {
    login(email, password) {
        return new Promise((resolve, reject) => {
            if (email === 'email@email.com' && password === 'pass123')
                resolve({ logged: true, error: '' });
            else
                reject({ logged: false, error: 'Invalid user name' });
        });
    }

    logout() {

    }
}

export default new LoginController();