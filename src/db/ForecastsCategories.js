import db from './index';

class ForecastsCategories {
    addCategory(category) {
        return db.forecasts_categories.put(category);
    }

    getAllCategories() {
        return db.forecasts_categories.toArray();
    }
}

export default new ForecastsCategories();