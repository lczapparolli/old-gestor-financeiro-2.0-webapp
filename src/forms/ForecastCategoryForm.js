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

class ForecastCategoryForm extends Component {
    constructor(props) {
        super(props);
        //Binding functions
        this.handleSubmit = this.handleSubmit.bind(this);
        //Setting state
        this.state = {
            name: { value: props.category.name, error: '' }
        };
        //Initializing form Helper
        this.formHelper = new FormHelper(this);
    }

    async validate() {
        const name = Object.assign({}, this.state.name);

        name.error = await this.props.onNameValidation(name.value);

        this.setState({ name });
        return name.error === '';
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (await this.validate()) {
            const category = {
                name: this.state.name.value
            };
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
    onSubmit: PropTypes.func.isRequired,
    onNameValidation: PropTypes.func.isRequired,
    category: PropTypes.shape({ name: PropTypes.string })
};

ForecastCategoryForm.defaultProps = {
    onNameValidation: () => '',
    category: { name: '' }
};

export default ForecastCategoryForm;