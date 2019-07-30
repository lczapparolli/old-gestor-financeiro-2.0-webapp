//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//Helpers
import FormHelper from '../helpers/FormHelper';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import InputField from '../components/InputField';
import ScreenSizes from '../helpers/ScreenSizes';
import Button, { ACTION_SUBMIT } from '../components/Button';

/**
 * Form for login page
 * Renders an email and a password fields
 */
class LoginForm extends Component {
    constructor(props) {
        super(props);
        //State
        this.state = {
            email: { value: '', error: ''},
            password: { value: '', error: ''}
        };
        //Form Helper
        this.formHelper = new FormHelper(this);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            email: this.state.email.value,
            password: this.state.password.value
        };
        this.props.onSubmit(data);
    }

    render() {
        const { email, password} = this.state;
        
        return (
            <form onSubmit={this.handleSubmit}>
                <GridRow sizeBreak={ScreenSizes.SCREEN_SMALL}>
                    <GridCell>
                        <InputField 
                            name="email" 
                            label="Email" 
                            type="email" 
                            required 
                            value={email.value} 
                            error={email.error} 
                            formHelper={this.formHelper}
                        />
                    </GridCell>
                    <GridCell>
                        <InputField
                            name="password"
                            label="Password"
                            type="password"
                            required
                            minLength="6"
                            value={password.value}
                            error={password.error}
                            formHelper={this.formHelper}
                        />
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <Button caption="Login" action={ACTION_SUBMIT} />
                    </GridCell>
                </GridRow>
            </form>
        );
    }
}

LoginForm.propTypes = {
    /** Function for handling form submit */
    onSubmit: PropTypes.func
};

export default LoginForm;