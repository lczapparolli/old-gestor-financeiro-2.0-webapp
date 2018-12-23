//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//Controllers
import loginController from '../controllers/LoginController';
//Components
import Button from '../components/Button';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        //Bindings
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    async handleLogoutClick() {
        await loginController.logout();
        this.props.onLogout();
    }

    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <Button caption="Logout" onClick={this.handleLogoutClick} />
            </div>
        );
    }
}

Dashboard.propTypes = {
    onLogout: PropTypes.func
};

export default Dashboard;