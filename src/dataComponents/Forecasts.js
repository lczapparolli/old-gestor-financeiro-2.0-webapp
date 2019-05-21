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

class Forecasts extends Component {
    constructor(props) {
        super(props);
        //Initial state
        this.state = {
            /** @type {import('../controllers/ForecastsController').ForecastList} */
            forecastList: {},
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
                                    <th className="NumberField">{formatNumber(forecastList.total, 'R$')}</th>
                                    <th className="NumberField">R$ 0,00</th>
                                </tr>
                            </tfoot>
                        </table>
                    </GridCell>
                </GridRow>
            </Fragment>
        );
    }
}

function Category({ category }) {
    const categoryLink = '/categories/' + category.id;
    const newForecastLink = '/forecasts/new?categoryId=' + category.id; 
    const forecastsComponents = category.forecasts.map(forecast => <Forecast key={forecast.id} forecast={forecast} />);

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
                <td className="NumberField">R$ 0,00</td>
            </tr>
        </Fragment>
    );
}

Category.propTypes = {
    /** Forecast category object */
    category: PropTypes.shape({
        /** Category id */ 
        id: PropTypes.number.isRequired,
        /** Category name */
        name: PropTypes.string.isRequired,
        /** List of forecasts */
        forecasts: PropTypes.array.isRequired,
        /** Sum of forecasts amount */
        total: PropTypes.number.isRequired
    }).isRequired,
};

function Forecast({ forecast }) {
    const forecastLink = '/forecasts/' + forecast.id;
    return (
        <tr>
            <td>
                <Link to={forecastLink} >{ forecast.name }</Link>
            </td>
            <td className="NumberField">{ formatNumber(forecast.amount, 'R$') }</td>
            <td className="NumberField">R$ 0,00</td>
        </tr>
    );
}

Forecast.propTypes = {
    /** Forecast object */
    forecast: PropTypes.shape({ 
        /** Forecast id */
        id: PropTypes.number.isRequired,
        /** Forecast name */
        name: PropTypes.string.isRequired,
        /** Forecast amount */
        amount: PropTypes.number.isRequired
    })
};

export default Forecasts;
export { Category, Forecast };
