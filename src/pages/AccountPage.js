//Libs
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
//Form
import AccountForm from '../forms/AccountForm';
import accountsController from '../controllers/AccountsController';
//Controller

class AccountPage extends Component {
    constructor(props) {
        super(props);
        //Bindings
        this.handleSubmit = this.handleSubmit.bind(this);
        //State
        this.state = {
            success: false
        };
    }

    async handleSubmit(account) {
        await accountsController.addAccount(account);
        this.setState({ success: true });
    }

    render() {
        if (this.state.success)
            return <Redirect to="/dashboard" />;
        //Implementar o carregamento de uma conta para edição
        return (
            <div>
                <h1>Account</h1>
                <AccountForm onSubmit={this.handleSubmit} />
                <Link to="/dashboard">Back</Link>
            </div>
        );
    }
}

export default AccountPage;