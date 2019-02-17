//Libs
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import forecastsCategoriesController from '../controllers/ForecastsCategoriesController';

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
                        <table>
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
    return (
        <tr>
            <td colSpan="3">{category.name}</td>
        </tr>
    );
}

Category.propTypes = {
    category: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired
};

export default Forecasts;
export { Category };