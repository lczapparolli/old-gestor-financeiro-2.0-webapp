import db from './index';
import Movement from '../models/Movement';

class Movements {
    /**
     * Inserts or updates a movement. If `id` is provided, then it is updated.
     * This method returns the id of the stored object.
     * @param {Movement} movement Movement to be save
     * @returns {Promise<Number>}
     */
    addMovement(movement) {
        return db.movements.put(movement);
    }

    /**
     * Returns the list of movements
     * @returns {Promise<Array<Movement>>}
     */
    getAllMovements() {
        return db.movements.toArray();
    }

    /**
     * Find a movement by its id
     * @param {Number} id The movement id to be searched
     * @returns {Promise<Movement>}
     */
    getById(id) {
        return db.movements.get(id);
    }

    /**
     * Deletes a movement from database
     * @param {Number} id The id of the movement to be removed
     * @returns {Promise}
     */
    deleteMovement(id) {
        return db.movements.delete(id);
    }

    /**
     * Starts a transaction and call a given method inside it
     * @param {Function} action The action to be called inside the transaction
     * @returns {Promise}
     */
    transaction(action) {
        return db.transaction(
            'rw', //mode
            db.movements, db.accounts, db.forecasts, //tables
            action //action
        );
    }
}

db.movements.mapToClass(Movement);

export default new Movements();