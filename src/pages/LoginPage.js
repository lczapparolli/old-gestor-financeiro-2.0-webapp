//Libs
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
//Components
import LoginForm from '../forms/LoginForm';
//Controllers
import loginController from '../controllers/LoginController';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        //Binds
        this.handleSubmit = this.handleSubmit.bind(this);
        //State
        this.state = {
            loading: false,
            logged: false,
            error: ''
        };
    }

    //TODO: Change to arrow functions

    async handleSubmit(data) {
        this.setState({ loading: true });
        const result = await loginController.login(data.email, data.password);
        this.setState({ logged: result.logged, error: result.error, loading: false });
        if (result.logged && this.props.onLogin)
            this.props.onLogin();
    }

    render() {
        const { logged, error, loading } = this.state;

        if (logged)
            return <Redirect to="/dashboard" />;

        return (
            <div>
                <h1>Log in</h1>
                <p>{ error }</p>
                <span>{ loading ? 'Loading' : '' }</span>
                <LoginForm onSubmit={this.handleSubmit} />
            </div>
        );
    }
}

LoginPage.propTypes = {
    onLogin: PropTypes.func
};

export default LoginPage;