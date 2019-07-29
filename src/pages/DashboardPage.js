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
import Movements from '../dataComponents/Movements';

class Dashboard extends Component {

    handleLogoutClick = async () => {
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
                <GridRow sizeBreak={ScreenSizes.SCREEN_SMALL} alignTop >
                    <GridCell>
                        <Accounts />
                    </GridCell>
                    <GridCell>
                        <Forecasts />
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <Movements />
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
    /** Callback function that is fired when the user successfully log out */
    onLogout: PropTypes.func
};

export default Dashboard;