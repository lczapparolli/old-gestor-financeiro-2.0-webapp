import db from './index';
import ForecastCategory from '../models/ForecastCategory';

class ForecastsCategories {
    /**
     * Inserts or updates a forecast category
     * @param {ForecastCategory} category The category to be save 
     * @returns {Promise}
     */
    addCategory(category) {
        return db.forecasts_categories.put(category);
    }

    /**
     * Update the name of a forecast category
     * @param {Number} id Id of the category to be updated
     * @param {String} name New category name
     * @returns {Promise}
     */
    updateCategoryName(id, name) {
        return db.forecasts_categories.update(id, { name });
    }

    /**
     * Returns an array with all categories of forecasts
     * @returns {Promise<Array<ForecastCategory>>}
     */
    getAllCategories() {
        return db.forecasts_categories.toArray();
    }

    /**
     * Finds a forecast category by its id
     * @param {Number} id Category id
     * @returns {Promise<ForecastCategory>}
     */
    getById(id) {
        return db.forecasts_categories.get(id);
    }

    /**
     * Finds a forecast category by its name
     * @param {String} name Category name
     * @returns {Promise<ForecastCategory>}
     */
    getByName(name) {
        return db.forecasts_categories.where('name').equalsIgnoreCase(name).toArray();
    }
}

db.forecasts_categories.mapToClass(ForecastCategory);

export default new ForecastsCategories();