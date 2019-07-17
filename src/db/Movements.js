import db from './index';

class Movements {
    addMovement(movement) {
        return db.movements.put(movement);
    }

    getAllMovements() {
        return db.movements.toArray();
    }

    getById(id) {
        return db.movements.get(id);
    }

    deleteMovement(id) {
        return db.movements.delete(id);
    }

    transaction(action) {
        return db.transaction(
            'rw', //mode
            db.movements, db.accounts, db.forecasts, //tables
            action //action
        );
    }
}

export default new Movements();