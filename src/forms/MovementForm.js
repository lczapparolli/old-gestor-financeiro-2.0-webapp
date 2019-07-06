//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//Components
import GridCell from '../components/GridCell';
import GridRow from '../components/GridRow';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Button, { ACTION_SUBMIT } from '../components/Button';
//Helpers
import FormHelper from '../helpers/FormHelper';
import ScreenSizes from '../helpers/ScreenSizes';
import { isNumeric, convertToNumber } from '../helpers/ConvertToNumber';
import formatNumber from '../helpers/FormatNumber';
import { isDate, convertToDate } from '../helpers/ConvertToDate';
//Controllers
import forecastsController from '../controllers/ForecastsController';
import accountsController from '../controllers/AccountsController';

class MovementForm extends Component {
    constructor(props) {
        super(props);
        //Initial state
        this.state = {
            accounts: [],
            forecasts: [],
            description: { value: props.movement.description, error: '' },
            forecastId: { value: props.movement.forecastId, error: '' },
            accountId: { value: props.movement.accountId, error: '' },
            value: { value: formatNumber(props.movement.value), error: '' },
            date: { value: props.movement.date, error: '' }
        };
        //Initializing formHelper
        this.formHelper = new FormHelper(this, { amount: this.amountValidation, date: this.dateValidation });
    }

    async componentDidMount() {
        const forecastList = await forecastsController.listAll();
        const accountList = await accountsController.listAll();
        const forecasts = forecastList.map(forecast => { return { value: forecast.id, text: forecast.name }; });
        const accounts = accountList.map(account => { return { value: account.id, text: account.name }; });
        this.setState({ forecasts, accounts });
    }

    handleSubmit = event => { 
        //TODO: Validate
        event.preventDefault();
        const movement = {
            description: this.state.description.value,
            forecastId: this.state.forecastId.value,
            accountId: this.state.accountId.value,
            value: convertToNumber(this.state.value.value),
            date: convertToDate(this.state.date.value),
        };
        this.props.onSubmit(movement);
    }

    amountValidation = value => {
        if (value !== '') {
            if (!isNumeric(value))
                return 'Invalid value';
        }
        return '';
    }

    dateValidation = date => {
        if (!isDate(date)) {
            return 'Invalid date';
        }
        return '';
    }

    render() {
        const { description, forecastId, accountId, value, date, accounts, forecasts } = this.state;

        return <form onSubmit={this.handleSubmit} >
            <GridRow sizeBreak={ScreenSizes.SCREEN_SMALL}>
                <GridCell>
                    <InputField
                        name="description"
                        label="Description"
                        formHelper={this.formHelper}
                        value={description.value}
                        error={description.error}
                        required
                    />
                </GridCell>
                <GridCell>
                    <SelectField
                        name="accountId"
                        label="Account"
                        items={accounts}
                        formHelper={this.formHelper}
                        value={accountId.value}
                        error={accountId.error}
                        placeholder="Select"
                        required
                    />
                </GridCell>
                <GridCell>
                    <SelectField
                        name="forecastId"
                        label="Budget"
                        items={forecasts}
                        formHelper={this.formHelper}
                        value={forecastId.value}
                        error={forecastId.error}
                        placeholder="Select"
                        required
                    />
                </GridCell>
                <GridCell>
                    <InputField
                        name="date"
                        label="Date"
                        formHelper={this.formHelper}
                        value={date.value}
                        error={date.error}
                        type="date"
                        required
                    />
                </GridCell>
                <GridCell>
                    <InputField
                        name="value"
                        label="Value"
                        formHelper={this.formHelper}
                        value={value.value}
                        error={value.error}
                        required
                    />
                </GridCell>
            </GridRow>
            <GridRow>
                <GridCell>
                    <Button caption="Save" action={ACTION_SUBMIT} />
                </GridCell>
            </GridRow>
        </form>;
    }
}

MovementForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    movement: PropTypes.shape({ 
        description: PropTypes.string.isRequired, 
        value: PropTypes.number.isRequired, 
        date: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number ]).isRequired, 
        forecastId: PropTypes.number.isRequired, 
        accountId: PropTypes.number.isRequired  
    })
};

MovementForm.defaultProps = {
    movement: {
        description: '',
        value: 0,
        date: '', //TODO: use current date without time
        forecastId: 0,
        accountId: 0
    }
};

export default MovementForm;