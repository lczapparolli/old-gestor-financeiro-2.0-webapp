import db from './index';

class Forecasts {

    addForecast(forecast) {
        return db.forecasts.put(forecast);
    }

    getAllForecasts() {
        return db.forecasts.toArray();
    }

}

export default new Forecasts();