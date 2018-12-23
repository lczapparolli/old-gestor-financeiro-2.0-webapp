import db from './index';

class Config {
    getLogged() {
        return db.config.get('logged');
    }

    setLogged(logged) {
        return db.config.put(logged, 'logged');
    }

    getToken() {
        return db.config.get('token');
    }

    setToken(token) {
        return db.config.put(token, 'token');
    }
}

export default new Config();