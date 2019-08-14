//Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//Helpers
import FormHelper from '../helpers/FormHelper';
//Components
import GridCell from '../components/GridCell';
import GridRow from '../components/GridRow';
import InputField from '../components/InputField';
import Button, { ACTION_SUBMIT } from '../components/Button';
//Models
import ForecastCategory from '../models/ForecastCategory';

class ForecastCategoryForm extends Component {
    constructor(props) {
        super(props);
        //Setting state
        this.state = {
            name: { value: props.category.name, error: '' }
        };
        //Initializing form Helper
        this.formHelper = new FormHelper(this);
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
            const category = new ForecastCategory(
                this.state.name.value
            );
            this.props.onSubmit(category);
        }
    }

    render() {
        const { name } = this.state;

        return (
            <form onSubmit={this.handleSubmit} >
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

ForecastCategoryForm.propTypes = {
    /** Callback function fired when form is submited */
    onSubmit: PropTypes.func.isRequired,
    /** Callback function fired when category name requires extra validation */
    onNameValidation: PropTypes.func.isRequired,
    /** Category object to be edited */
    category: PropTypes.instanceOf(ForecastCategory)
};

ForecastCategoryForm.defaultProps = {
    onNameValidation: () => '',
    category: new ForecastCategory('', '')
};

export default ForecastCategoryForm;