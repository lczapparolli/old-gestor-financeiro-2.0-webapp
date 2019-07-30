//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import InputField from '../components/InputField';
import Button, { ACTION_SUBMIT } from '../components/Button';
//Helpers
import FormHelper from '../helpers/FormHelper';
import formatNumber from '../helpers/FormatNumber';
import { convertToNumber, isNumeric } from '../helpers/ConvertToNumber';

class ForecastForm extends Component {
    constructor(props) {
        super(props);
        //Initial state
        this.state = {
            name: { value: props.forecast.name, error: '' },
            amount: { value: formatNumber(props.forecast.amount), error: '' }
        };
        //Form helper
        this.formHelper = new FormHelper(this, { amount: this.amountValidation });
    }

    amountValidation = (amount) => {
        if (amount !== '') {
            if (!isNumeric(amount))
                return 'Invalid value';
        }
        return '';
    }

    validate = async () => {
        const name = Object.assign({}, this.state.name);

        name.error = await this.props.onNameValidation(name.value);

        this.setState({ name });
        return name.error === '';
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (await this.validate()) {
            const forecast = {
                name: this.state.name.value,
                amount: convertToNumber(this.state.amount.value)
            };
            this.props.onSubmit(forecast);
        }
    }

    render() {
        const { name, amount } = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <GridRow>
                    <GridCell>
                        <InputField 
                            name="name"
                            label="Name"
                            value={name.value}
                            error={name.error}
                            formHelper={this.formHelper}
                            required
                        />
                    </GridCell>
                    <GridCell>
                        <InputField
                            name="amount"
                            label="Amount"
                            value={amount.value}
                            error={amount.error}
                            formHelper={this.formHelper}
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

ForecastForm.propTypes = {
    /** Callback function fired when form is submited */
    onSubmit: PropTypes.func.isRequired,
    /** Callback function fired when forecast name requires extra validation */
    onNameValidation: PropTypes.func,
    /** Forecast object to be edited */
    forecast: PropTypes.shape({ name: PropTypes.string, amount: PropTypes.number })
};

ForecastForm.defaultProps = {
    onNameValidation: () => '',
    forecast: { name: '', amount: 0 }
};

export default ForecastForm;