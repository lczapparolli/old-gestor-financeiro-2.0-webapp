import db from './index';

class Forecasts {

    addForecast(forecast) {
        return db.forecasts.put(forecast);
    }

    getAllForecasts() {
        return db.forecasts.toArray();
    }

    getByCategory(categoryId) {
        return db.forecasts.where({ categoryId }).toArray();
    }

    getByName(name) {
        return db.forecasts.where('name').equalsIgnoreCase(name).toArray();
    }

    getById(id) {
        return db.forecasts.get(id);
    }

}

export default new Forecasts();