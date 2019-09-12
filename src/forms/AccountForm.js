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
            initialValue: { value: formatNumber(account.initialValue), error: '' },
            type: { value: account.type, error: '' }
        };
        //Initializing formHelper
        this.formHelper = new FormHelper(this, { type: this.typeValidation, initialValue: this.initialValueValidation });
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

    initialValueValidation = (value) => {
        if (value !== '') {
            if (!isNumeric(value))
                return 'Invalid value';
        }
        return '';
    }

    validate = async () => {
        const name = Object.assign({}, this.state.name);
        const type = Object.assign({}, this.state.type);
        const initialValue = Object.assign({}, this.state.initialValue);
        
        name.error = await this.props.onNameValidate(name.value);
        type.error = this.typeValidation(type.value);
        initialValue.error = this.initialValueValidation(initialValue.value);
        
        this.setState({ name, type, initialValue });
        return name.error === '' && type.error === '' && initialValue.error === '';
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (await this.validate()) {
            const account = new Account(
                this.state.name.value,
                this.state.type.value,
                convertToNumber(this.state.initialValue.value),
            );
            this.props.onSubmit(account);
        }
    }

    render () {
        const { name, initialValue, type } = this.state;
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
                            name="initialValue"
                            label="Initial value"
                            formHelper={this.formHelper}
                            error={initialValue.error}
                            value={initialValue.value}
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