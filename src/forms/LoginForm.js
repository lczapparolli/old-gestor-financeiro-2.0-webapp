//Libs
import React from 'react';
import PropTypes from 'prop-types';
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
function LoginForm({ email, password, handleSubmit, formHelper }) {
    return (
        <form onSubmit={handleSubmit}>
            <GridRow sizeBreak={ScreenSizes.SCREEN_SMALL}>
                <GridCell>
                    <InputField name="email" label="Email" type="email" required value={email.value} error={email.error} formHelper={formHelper} />
                </GridCell>
                <GridCell>
                    <InputField name="password" label="Password" type="password" minLength="6" value={password.value} error={password.error} formHelper={formHelper} />
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

LoginForm.propTypes = {
    /** Email value and error message */
    email: PropTypes.shape({ value: PropTypes.string, error: PropTypes.string }),
    /** Password value and error message */
    password: PropTypes.shape({ value: PropTypes.string, error: PropTypes.string }),
    /** Function for handling form submit */
    handleSubmit: PropTypes.func,
    /** Helper for handling input change and validation */
    formHelper: PropTypes.shape({handleChange: PropTypes.func, handleInvalid: PropTypes.func})
};

export default LoginForm;