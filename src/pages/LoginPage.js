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
        //State
        this.state = {
            loading: false,
            logged: false,
            error: ''
        };
    }

    handleSubmit = async (data) => {
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
    /** Callback function that is fired when the user successfully log in  */
    onLogin: PropTypes.func
};

export default LoginPage;