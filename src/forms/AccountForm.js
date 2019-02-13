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
//DB
import { ACCOUNT_TYPES, CHECKING, CREDIT, SAVINGS } from '../controllers/AccountsController';

class AccountForm extends Component {
    constructor(props) {
        super(props);
        //Bindings
        this.handleSubmit = this.handleSubmit.bind(this);
        this.typeValidation = this.typeValidation.bind(this);
        this.balanceValidation = this.balanceValidation.bind(this);
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

    typeValidation(value) {
        if (!ACCOUNT_TYPES.includes(value))
            return 'Invalid account type';
        else
            return '';
    }

    balanceValidation(value) {
        if (value !== '') {
            if (!isNumeric(value))
                return 'Invalid value';
        }
        return '';
    }

    async validate() {
        const name = Object.assign({}, this.state.name);
        const type = Object.assign({}, this.state.type);
        const balance = Object.assign({}, this.state.balance);
        
        name.error = await this.props.onNameValidate(name.value);
        type.error = this.typeValidation(type.value);
        balance.error = this.balanceValidation(balance.value);
        
        this.setState({ name, type, balance });
        return name.error === '' && type.error === '' && balance.error === '';
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (await this.validate()) {
            const data = {
                name: this.state.name.value,
                balance: convertToNumber(this.state.balance.value),
                type: this.state.type.value
            };
            this.props.onSubmit(data);
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
    onSubmit: PropTypes.func,
    onNameValidate: PropTypes.func,
    account: PropTypes.shape({ name: PropTypes.string, balance: PropTypes.number, type: PropTypes.string })
};

AccountForm.defaultProps = {
    account: { name: '', balance: 0, type: '' },
    onNameValidate: () => ''
};

export default AccountForm;