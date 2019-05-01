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
}

export default new Movements();