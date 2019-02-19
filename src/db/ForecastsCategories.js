import db from './index';

class ForecastsCategories {
    addCategory(category) {
        return db.forecasts_categories.put(category);
    }

    updateCategoryName(id, name) {
        return db.forecasts_categories.update(id, { name });
    }

    getAllCategories() {
        return db.forecasts_categories.toArray();
    }

    getById(id) {
        return db.forecasts_categories.get(id);
    }
}

export default new ForecastsCategories();