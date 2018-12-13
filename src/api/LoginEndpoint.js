import axios from 'axios';

class LoginEndpoint {
    login(email, password) {
        return axios.post('users/login', { email, password });
    }
}

export default new LoginEndpoint();