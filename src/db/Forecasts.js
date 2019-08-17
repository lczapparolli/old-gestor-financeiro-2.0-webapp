import db from './index';
import Forecast from '../models/Forecast';

class Forecasts {

    /**
     * Inserts or updates a forecast
     * @param {Forecast} forecast Forecast to be inserted
     * @returns {Promise}
     */
    addForecast(forecast) {
        return db.forecasts.put(forecast);
    }

    /**
     * Updates only the balance field of a given forecast
     * @param {Number} id Id of the forecast to be updated
     * @param {Number} balance The new balance
     * @returns {Promise}
     */
    updateBalance(id, balance) {
        return db.forecasts.update(id, { balance });
    }

    /**
     * Returns an array of forecasts
     * @returns {Promise<Array<Forecast>>}
     */
    getAllForecasts() {
        return db.forecasts.toArray();
    }

    /**
     * Returns an array of forecasts with a given category
     * @param {Number} categoryId The category id to search
     * @returns {Promise<Array<Forecast>>}
     */
    getByCategory(categoryId) {
        return db.forecasts.where({ categoryId }).toArray();
    }

    /**
     * Returns a forecast with same name provided
     * @param {String} name Forecast name to search
     * @returns {Promise<Forecast>}
     */
    getByName(name) {
        return db.forecasts.where('name').equalsIgnoreCase(name).toArray();
    }

    /**
     * Returns a forecast with given id
     * @param {Number} id Forecast id to search
     * @returns {Promise<Forecast>}
     */
    getById(id) {
        return db.forecasts.get(id);
    }

}

db.forecasts.mapToClass(Forecast);

export default new Forecasts();