//Libs
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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

    async handleSubmit(data) {
        try {
            this.setState({ loading: true });
            const result = await loginController.login(data.email, data.password);
            this.setState({ logged: result.logged, loading: false });
        } catch (exception) {
            this.setState({
                logged: exception.logged,
                error: exception.error,
                loading: false
            });
        }
    }

    render() {
        const { logged, error, loading } = this.state;

        if (logged)
            return <Redirect to="/" />;

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

export default LoginPage;