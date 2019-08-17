//Libs
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//Style
import '../style/DataComponent.scss';
//Controller
import forecastsController from '../controllers/ForecastsController';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Helpers
import formatNumber from '../helpers/FormatNumber';
//Models
import Forecast from '../models/Forecast';
import ForecastCategoryList from '../models/ForecastCategoryList';
import ForecastList from '../models/ForecastList';

/**
 * Component to list categories and forecasts and provide a link to add new ones.
 */
class Forecasts extends Component {
    constructor(props) {
        super(props);
        //Initial state
        this.state = {
            forecastList: new ForecastCategoryList(),
            loading: true
        };
    }

    async componentDidMount() {
        const forecastList = await forecastsController.findAll();
        this.setState({ forecastList, loading: false });
    }

    render() {
        const { loading, forecastList } = this.state;

        if (loading)
            return <h1>Loading</h1>;

        const categoriesComponents = forecastList.categories.map(category => <Category key={category.id} category={category} />);

        return (
            <Fragment>
                <GridRow>
                    <GridCell>
                        <h2>Forecasts</h2>
                    </GridCell>
                    <GridCell shrink>
                        <Link to="/categories/new">+</Link>
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <table className="DataComponent">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th className="NumberField">Forecast</th>
                                    <th className="NumberField">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriesComponents}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Total</th>
                                    <th className="NumberField">{ formatNumber(forecastList.total, 'R$') }</th>
                                    <th className="NumberField">{ formatNumber(forecastList.totalBalance, 'R$') }</th>
                                </tr>
                            </tfoot>
                        </table>
                    </GridCell>
                </GridRow>
            </Fragment>
        );
    }
}

/**
 * Show a category and list their respectives forecasts with total
 */
function Category({ category }) {
    const categoryLink = '/categories/' + category.id;
    const newForecastLink = '/forecasts/new?categoryId=' + category.id; 
    const forecastsComponents = category.forecasts.map(forecast => <ForecastItem key={forecast.id} forecast={forecast} />);

    return (
        <Fragment>
            <tr className="CategoryHeader">
                <th colSpan="2">
                    <Link to={categoryLink}>{category.name}</Link>
                </th>
                <th className="NumberField">
                    <Link to={newForecastLink}>+</Link>
                </th>
            </tr>
            { forecastsComponents }
            <tr className="CategoryTotal">
                <td>Sub-total</td>
                <td className="NumberField">{ formatNumber(category.total, 'R$') }</td>
                <td className="NumberField">{ formatNumber(category.totalBalance, 'R$') }</td>
            </tr>
        </Fragment>
    );
}

Category.propTypes = {
    /** Forecast category object */
    category: PropTypes.instanceOf(ForecastList).isRequired,
};

/**
 * Show a forecast with amount and balance values
 */
function ForecastItem({ forecast }) {
    const forecastLink = '/forecasts/' + forecast.id;
    return (
        <tr>
            <td>
                <Link to={forecastLink} >{ forecast.name }</Link>
            </td>
            <td className="NumberField">{ formatNumber(forecast.amount, 'R$') }</td>
            <td className="NumberField">{ formatNumber(forecast.balance, 'R$') }</td>
        </tr>
    );
}

ForecastItem.propTypes = {
    /** Forecast object */
    forecast: PropTypes.instanceOf(Forecast)
};

export default Forecasts;
export { Category, ForecastItem };
