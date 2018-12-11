//Libs
import React, { Component } from 'react';
//Helpers
import FormHelper from '../helpers/FormHelper';
//Components
import LoginForm from '../forms/LoginForm';

class LoginPage extends Component {
    constructor() {
        super();
        //Binds
        this.handleSubmit = this.handleSubmit.bind(this);
        //State
        this.state = {
            email: { value: '', error: '' },
            password: { value: '', error: '' }
        };
        //Form Helper
        this.formHelper = new FormHelper(this);
    }

    handleSubmit() {
    }

    render() {
        const { email, password } = this.state;
        return (
            <div>
                <h1>Log in</h1>
                <LoginForm email={email} password={password} handleSubmit={this.handleSubmit} formHelper={this.formHelper} />
            </div>
        );
    }
}

export default LoginPage;