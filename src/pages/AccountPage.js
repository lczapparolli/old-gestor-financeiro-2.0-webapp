//Libs
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//Form
import AccountForm from '../forms/AccountForm';

class AccountPage extends Component {

    handleSubmit() {

    }

    render() {
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