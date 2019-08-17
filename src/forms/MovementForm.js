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
import formatDate, { FORMATS } from '../helpers/FormatDate';
import { isDate, convertToDate } from '../helpers/ConvertToDate';
//Controllers
import forecastsController from '../controllers/ForecastsController';
import accountsController from '../controllers/AccountsController';
import Movement from '../models/Movement';

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
            date: { value: formatDate(props.movement.date, FORMATS.YYYYMMDD_FORMAT), error: '' }
        };
        //Initializing formHelper
        this.formHelper = new FormHelper(this, { amount: this.amountValidation, date: this.dateValidation });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const movement = new Movement(
            this.state.accountId.value,
            this.state.forecastId.value,
            this.state.description.value,
            convertToNumber(this.state.value.value),
            convertToDate(this.state.date.value),
        );
        this.props.onSubmit(movement);
    }

    amountValidation = (value) => {
        if (value !== '') {
            if (!isNumeric(value))
                return 'Invalid value';
        }
        return '';
    }

    dateValidation = (date) => {
        if (!isDate(date)) {
            return 'Invalid date';
        }
        return '';
    }

    async componentDidMount() {
        const forecastList = await forecastsController.listAll();
        const accountList = await accountsController.listAll();
        const forecasts = forecastList.map(forecast => { return { value: forecast.id, text: forecast.name }; });
        const accounts = accountList.map(account => { return { value: account.id, text: account.name }; });
        this.setState({ forecasts, accounts });
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
    /** Callback function fired when form is submited */
    onSubmit: PropTypes.func.isRequired,
    /** Movement object to be edited */
    movement: PropTypes.instanceOf(Movement)
};

MovementForm.defaultProps = {
    movement: new Movement(0, 0, '', 0, new Date(Date.now()))
};

export default MovementForm;