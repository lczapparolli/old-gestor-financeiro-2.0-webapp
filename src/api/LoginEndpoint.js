import axios from 'axios';

const { NODE_ENV } = process.env;

class LoginEndpoint {
    login(email, password) {
        if (NODE_ENV === 'development') {
            return Promise.resolve({ token: 'valid token' });
        } else {
            return axios.post('users/login', { email, password })
                .then(result => {
                    return result.data;
                });
        }
    }
}

export default new LoginEndpoint();
