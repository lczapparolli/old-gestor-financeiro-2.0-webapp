//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//Components
import Button, { ACTION_BUTTON, STYLE_DEFAULT } from './Button';
import GridRow from './GridRow';
import GridCell from './GridCell';
//Helpers
import { convertToNumber } from '../helpers/ConvertToNumber';
import FormHelper from '../helpers/FormHelper';
//Style
import '../style/InputField.scss';

class DateNavigator extends Component {
    constructor(props) {
        super(props);

        const { month, year } = props;

        this.state = {
            period: this.formatDate(month, year)
        };

        this.formHelper = new FormHelper(this, {});
    }

    handleNextClick = () => {
        const { month, year } = this.incrementDate(+1);
        this.setState({ period: this.formatDate(month, year) });
        this.props.onChange({ month, year });
    }

    handlePriorClick = () => {
        const { month, year } = this.incrementDate(-1);
        this.setState({ period: this.formatDate(month, year) });
        this.props.onChange({ month, year });
    }

    handleInputChange = (event) => {
        const inputValue = event.target.value;
        this.setState({ period: inputValue });
    }

    handleInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            const date = this.extractFields(this.state.period);
            if (date) {
                this.setState({ period: this.formatDate(date.month, date.year) });
                this.props.onChange({ month: date.month, year: date.year });
            } else {
                this.setState({ period: this.formatDate(this.props.month, this.props.year) });
            }
        }
    }

    handleInputBlur = () => {
        const date = this.extractFields(this.state.period);
        if (date) {
            this.setState({ period: this.formatDate(date.month, date.year) });
            this.props.onChange({ month: date.month, year: date.year });
        } else {
            this.setState({ period: this.formatDate(this.props.month, this.props.year) });
        }
    }

    render() {
        const { period } = this.state;

        return (
            <GridRow>
                <GridCell>
                    <Button action={ACTION_BUTTON} style={STYLE_DEFAULT} caption="<" onClick={this.handlePriorClick} />
                </GridCell>
                <GridCell>
                    <div className="InputField" >
                        <input 
                            name="period"
                            id="period"
                            value={period}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleInputKeyPress}
                            onBlur={this.handleInputBlur}
                        />
                    </div>
                </GridCell>
                <GridCell>
                    <Button action={ACTION_BUTTON} style={STYLE_DEFAULT} caption=">" onClick={this.handleNextClick} />
                </GridCell>
            </GridRow>
        );
    }

    formatDate = (month, year) => {
        return month.toString().padStart(2, '0') + '/' + year.toString().padStart(4, '0');
    }

    incrementDate = (increment) => {
        let { month, year } = this.props;
        month = convertToNumber(month);
        year = convertToNumber(year);

        month += increment;
        if (month >= 13) {
            month = 1;
            year++;
        } else if (month <= 0) {
            month = 12;
            year--;
        }

        return { month, year };
    }

    extractFields = (period) => {
        const regex = /(\d+)\/(\d+)/;
        const match = regex.exec(period);
        if (match) {
            const month = convertToNumber(match[1]);
            const year = convertToNumber(match[2]);
            return { month, year };
        } else 
            return null;
    }
}

DateNavigator.propTypes = {
    /** Month displayed by component */
    month: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    /** Year displayed by component */
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    /** Callback function fired when value changes */
    onChange: PropTypes.func.isRequired
};

export default DateNavigator;