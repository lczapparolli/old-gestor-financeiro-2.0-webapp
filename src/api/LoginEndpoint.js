import axios from 'axios';

class LoginEndpoint {
    login(email, password) {
        return axios.post('users/login', { email, password })
            .then(result => {
                return result.data;
            });
    }
}

export default new LoginEndpoint();