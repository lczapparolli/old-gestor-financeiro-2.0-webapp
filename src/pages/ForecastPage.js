//Libs
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Form
import ForecastForm from '../forms/ForecastForm';

class ForecastPage extends Component {
    render() {
        return (
            <Fragment>
                <GridRow>
                    <GridCell>
                        <h1>Forecast Category</h1>
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <ForecastForm/>
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

export default ForecastPage;