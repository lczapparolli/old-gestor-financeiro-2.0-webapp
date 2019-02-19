//Libs
import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Helpers
import { convertToNumber } from '../helpers/ConvertToNumber';
//Controller
import forecastsCategoriesController from '../controllers/ForecastsCategoriesController';
//Form
import ForecastCategoryForm from '../forms/ForecastCategoryForm';

class ForecastCategoryPage extends Component {
    constructor(props) {
        super(props);
        //Bindings
        this.onSubmit = this.onSubmit.bind(this);
        this.getId = this.getId.bind(this);
        //State
        this.state = {
            loading: true,
            category: { name: '', type: '' },
            success: false
        };
    }

    getId() {
        if (this.props.match.params.id !== 'new')
            return convertToNumber(this.props.match.params.id);
        else
            return 0;
    }

    async componentDidMount() {
        let category = { name: '', type: '' };
        const id = this.getId();
        if (id > 0)
            category = await forecastsCategoriesController.getById(id);
        this.setState({ loading: false, category });
    }

    //TODO: Add duplicated name validation

    async onSubmit(category) {
        const id = this.getId();
        if (id > 0) 
            category.id = id;
        await forecastsCategoriesController.saveCategory(category);
        this.setState({ success: true });
    }

    render() {
        const { success, loading, category } = this.state;

        if (success)
            return <Redirect to="/dashboard" />;
        
        if (loading)
            return <h1>Loading</h1>;

        return (
            <Fragment>
                <GridRow>
                    <GridCell>
                        <h1>Forecast Category</h1>
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <ForecastCategoryForm onSubmit={this.onSubmit} category={category} />
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <Link to="/dashboard">Back</Link>
                    </GridCell>
                </GridRow>
            </Fragment>
        );
    }
}

ForecastCategoryPage.propTypes = {
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) })
};

export default ForecastCategoryPage;