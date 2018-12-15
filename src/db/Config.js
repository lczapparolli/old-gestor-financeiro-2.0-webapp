import db from './index';

class Config {
    getLogged() {
        return db.config.get('logged');
    }

    setLogged(logged) {
        return db.config.put(logged, 'logged');
    }
}

export default new Config();