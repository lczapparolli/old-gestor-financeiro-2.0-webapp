//Libs
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
//Controllers
import loginController from '../controllers/LoginController';
//Components
import Button from '../components/Button';
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Helpers
import ScreenSizes from '../helpers/ScreenSizes';
//Data components
import Accounts from '../dataComponents/Accounts';
import Forecasts from '../dataComponents/Forecasts';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        //Bindings
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    //TODO: Change to arrow functions

    async handleLogoutClick() {
        await loginController.logout();
        this.props.onLogout();
    }

    render() {
        return (
            <Fragment>
                <GridRow>
                    <GridCell>
                        <h1>Dashboard</h1>
                    </GridCell>
                </GridRow>
                <GridRow sizeBreak={ScreenSizes.SCREEN_SMALL}>
                    <GridCell>
                        <Accounts />
                    </GridCell>
                    <GridCell>
                        <Forecasts />
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <Button caption="Logout" onClick={this.handleLogoutClick} />
                    </GridCell>
                </GridRow>
            </Fragment>
        );
    }
}

Dashboard.propTypes = {
    onLogout: PropTypes.func
};

export default Dashboard;