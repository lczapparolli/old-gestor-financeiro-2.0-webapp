//Libs
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//Style
import '../style/DataComponent.scss';
//Controller
import forecastsCategoriesController from '../controllers/ForecastsCategoriesController';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';

class Forecasts extends Component {
    constructor(props) {
        super(props);
        //Initial state
        this.state = {
            categories: [],
            loading: true
        };
    }

    async componentDidMount() {
        const categories = await forecastsCategoriesController.findAll();
        this.setState({ categories, loading: false });
    }

    render() {
        const { loading, categories } = this.state;

        if (loading)
            return <h1>Loading</h1>;

        const categoriesComponents = categories.map(category => <Category key={category.id} category={category} />);

        return (
            <Fragment>
                <GridRow>
                    <GridCell>
                        <h2>Forecasts</h2>
                    </GridCell>
                    <GridCell shrink>
                        <Link to="/category/new">+</Link>
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <table className="DataComponent">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Forecast</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriesComponents}
                            </tbody>
                        </table>
                    </GridCell>
                </GridRow>
            </Fragment>
        );
    }
}

function Category({ category }) {
    const categoryLink = '/category/' + category.id;
    const forecastsComponents = (
        <tr>
            <td>Test 1</td>
            <td className="NumberField">R$ 0,00</td>
            <td className="NumberField">R$ 0,00</td>
        </tr>
    );

    return (
        <Fragment>
            <tr className="CategoryHeader">
                <th colSpan="3">
                    <Link to={categoryLink}>{category.name}</Link>
                </th>
            </tr>
            { forecastsComponents }
            <tr className="CategoryTotal">
                <td>Sub-total</td>
                <td className="NumberField">R$ 0,00</td>
                <td className="NumberField">R$ 0,00</td>
            </tr>
        </Fragment>
    );
}

Category.propTypes = {
    category: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string.isRequired }).isRequired
};

export default Forecasts;
export { Category };
