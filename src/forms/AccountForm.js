//Libs
import React, {Component} from 'react';
import PropTypes from 'prop-types';
//Components
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import Button, { ACTION_SUBMIT } from '../components/Button';
//Helpers
import FormHelper from '../helpers/FormHelper';
import ScreenSizes from '../helpers/ScreenSizes';
import {isNumeric, convertToNumber} from '../helpers/ConvertToNumber';
import formatNumber from '../helpers/FormatNumber';
//Models
import Account, { ACCOUNT_TYPES, CHECKING, CREDIT, SAVINGS } from '../models/Account';

class AccountForm extends Component {
    constructor(props) {
        super(props);
        //Setting state
        const { account } = this.props;
        this.state = {
            name: { value: account.name, error: '' },
            balance: { value: formatNumber(account.balance), error: '' },
            type: { value: account.type, error: '' }
        };
        //Initializing formHelper
        this.formHelper = new FormHelper(this, { type: this.typeValidation, balance: this.balanceValidation });
        //Account types
        this.accountTypes = [
            { value: CHECKING, text: 'Account' },
            { value: CREDIT, text: 'Credit Card' },
            { value: SAVINGS, text: 'Investment' },
        ];
    }

    typeValidation = (value) => {
        if (!ACCOUNT_TYPES.includes(value))
            return 'Invalid account type';
        else
            return '';
    }

    balanceValidation = (value) => {
        if (value !== '') {
            if (!isNumeric(value))
                return 'Invalid value';
        }
        return '';
    }

    validate = async () => {
        const name = Object.assign({}, this.state.name);
        const type = Object.assign({}, this.state.type);
        const balance = Object.assign({}, this.state.balance);
        
        name.error = await this.props.onNameValidate(name.value);
        type.error = this.typeValidation(type.value);
        balance.error = this.balanceValidation(balance.value);
        
        this.setState({ name, type, balance });
        return name.error === '' && type.error === '' && balance.error === '';
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (await this.validate()) {
            const account = new Account(
                this.state.name.value,
                this.state.type.value,
                convertToNumber(this.state.balance.value),
            );
            this.props.onSubmit(account);
        }
    }

    render () {
        const { name, balance, type } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <GridRow sizeBreak={ScreenSizes.SCREEN_MEDIUM}>
                    <GridCell>
                        <InputField
                            name="name" 
                            label="Name"
                            formHelper={this.formHelper}
                            error={name.error}
                            value={name.value}
                            required
                        />
                    </GridCell>
                    <GridCell>
                        <InputField
                            name="balance"
                            label="Initial balance"
                            formHelper={this.formHelper}
                            error={balance.error}
                            value={balance.value}
                            required
                        />
                    </GridCell>
                    <GridCell>
                        <SelectField
                            name="type"
                            label="Type"
                            formHelper={this.formHelper}
                            error={type.error}
                            value={type.value}
                            items={this.accountTypes}
                            placeholder="< Select type >"
                            required
                        />
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <Button caption="Save" action={ACTION_SUBMIT} />
                    </GridCell>
                </GridRow>
            </form>
        );
    }
}

AccountForm.propTypes = {
    /** Callback function fired when form is submited */
    onSubmit: PropTypes.func,
    /** Callback function fired when account name requires extra validation */
    onNameValidate: PropTypes.func,
    /** Account object to be edited */
    account: PropTypes.instanceOf(Account)
};

AccountForm.defaultProps = {
    account: new Account('', '', 0),
    onNameValidate: () => ''
};

export default AccountForm;