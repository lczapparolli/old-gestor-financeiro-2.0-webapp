//Libs
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
//Form
import AccountForm from '../forms/AccountForm';
import { convertToNumber } from '../helpers/ConvertToNumber';
//Controller
import accountsController from '../controllers/AccountsController';
//Models
import Account from '../models/Account';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        //State
        this.state = {
            success: false,
            loading: true,
            error: '',
            account: new Account('', '', 0)
        };
    }

    getId = () => {
        if (this.props.match.params.id !== 'new')
            return convertToNumber(this.props.match.params.id);
        else
            return 0;
    }

    handleNameValidate = async (accountName) => {
        const id = this.getId();
        const account = await accountsController.getByName(accountName);
        //if account is not found or is the same account added
        if (!account || account.id === id)
            return '';
        else
            return 'Account name must be unique';
    }

    handleSubmit = async (account) => {
        const id = this.getId();
        if (id > 0)
            account.id = id;
        await accountsController.saveAccount(account);
        this.setState({ success: true });
    }

    async componentDidMount() {
        let account = new Account('', '', 0);
        const id = this.getId();
        if (id > 0) {
            account = await accountsController.getById(id);
        }
        this.setState({ loading: false, account });
    }

    render() {
        const { success, loading, account } = this.state;
        if (success)
            return <Redirect to="/dashboard" />;
        if (loading)
            return <h1>Loading</h1>;
        return (
            <div>
                <h1>Account</h1>
                <AccountForm account={account} onNameValidate={this.handleNameValidate} onSubmit={this.handleSubmit} />
                <Link to="/dashboard">Back</Link>
            </div>
        );
    }
}

AccountPage.propTypes = {
    /** Match object to get URL parameters */
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) })
};

export default AccountPage;