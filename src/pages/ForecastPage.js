//Libs
import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'query-string';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Controller
import forecastsController from '../controllers/ForecastsController';
//Helpers
import { convertToNumber } from '../helpers/ConvertToNumber';
//Form
import ForecastForm from '../forms/ForecastForm';

class ForecastPage extends Component {
    constructor(props) {
        super(props);
        //Bindings
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameValidate = this.handleNameValidate.bind(this);
        //Static data
        this.forecastId = this.getId();
        this.categoryId = this.getCategoryId();
        //State
        this.state = {
            success: false,
            loading: true,
            error: '',
            forecast: { name: '', amount: 0, categoryId: 0 }
        };
    }

    getCategoryId() {
        const params = qs.parse(this.props.location.search);
        if (params.categoryId)
            return convertToNumber(params.categoryId);
        else 
            return 0;
    }

    getId() {
        if (this.props.match.params.id !== 'new')
            return convertToNumber(this.props.match.params.id);
        else
            return 0;
    }

    async handleSubmit(forecast) {
        if (this.forecastId > 0) 
            forecast.id = this.forecastId;
        //TODO: Update only `name` and `amount` fields
        forecast.categoryId = this.categoryId;
        forecast.value = 0;
        await forecastsController.saveForecast(forecast);
        this.setState({ success: true });
    }

    async handleNameValidate(forecastName) {
        const forecast = await forecastsController.getByName(forecastName);
        //if forecast is not found or is the same forecast added
        if (!forecast || forecast.id === this.forecastId)
            return '';
        else
            return 'Forecast name must be unique';
    }

    async componentDidMount() {
        let forecast = { name: '', amount: 0 };
        if (this.forecastId > 0) {
            forecast = await forecastsController.getById(this.forecastId);
            this.categoryId = forecast.categoryId;
        }
        this.setState({ loading: false, forecast });
    }

    render() {
        const { success, loading, forecast } = this.state;
        if (success)
            return <Redirect to="/dashboard" />;
        if (loading)
            return <h1>Loading</h1>;
        return (
            <Fragment>
                <GridRow>
                    <GridCell>
                        <h1>Forecast</h1>
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <ForecastForm forecast={forecast} onSubmit={this.handleSubmit} onNameValidation={this.handleNameValidate} />
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

ForecastPage.propTypes = {
    location: PropTypes.shape({ search:PropTypes.string }),
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) })
};

export default ForecastPage;