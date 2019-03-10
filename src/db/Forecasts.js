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

}

export default new Forecasts();