//Libs
import React, { Component } from 'react';
//Components
import LoginForm from '../forms/LoginForm';

class LoginPage extends Component {
    constructor() {
        super();
        //Binds
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
    }

    render() {
        return (
            <div>
                <h1>Log in</h1>
                <LoginForm onSubmit={this.handleSubmit} />
            </div>
        );
    }
}

export default LoginPage;