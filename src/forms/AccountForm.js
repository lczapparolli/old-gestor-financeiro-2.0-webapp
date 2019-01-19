//Libs
import React, {Component} from 'react';
import PropTypes from 'prop-types';
//Components
import InputField from '../components/InputField';
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import Button, { ACTION_SUBMIT } from '../components/Button';
//Helpers
import FormHelper from '../helpers/FormHelper';
import ScreenSizes from '../helpers/ScreenSizes';
//DB
import accountsController from '../controllers/AccountsController';

class AccountForm extends Component {
    constructor(props) {
        super(props);
        //Bindings
        this.handleSubmit = this.handleSubmit.bind(this);
        //Setting state
        this.state = {
            name: { value: '', error: '' },
            balance: { value: '', error: '' },
            type: { value: '', error: '' }
        };
        //Initializing formHelper
        this.formHelper = new FormHelper(this);
    }

    async nameValidation(value) {
        const account = await accountsController.findByName(value);
        if (account)
            return 'Account name already used';
        else
            return '';
    }

    async validate() {
        const name = Object.assign({}, this.state.name);
        name.error = await this.nameValidation(name.value);
        if (name.error !== '')
            this.setState({ name });
        return name.error === '';
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (await this.validate()) {
            const data = {
                name: this.state.name.value,
                balance: this.state.balance.value,
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
                        <InputField
                            name="type"
                            label="Type"
                            formHelper={this.formHelper}
                            error={type.error}
                            value={type.value}
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
    onSubmit: PropTypes.func
};

export default AccountForm;