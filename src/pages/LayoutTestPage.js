//Libs
import React from 'react';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import InputField from '../components/InputField';
import Button, { STYLE_DEFAULT, STYLE_DANGER, ACTION_SUBMIT } from '../components/Button';
//Helpers
import ScreenSizes from '../helpers/ScreenSizes';
import FormHelper from '../helpers/FormHelper';
import SelectField from '../components/SelectField';

class LayoutTestPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text1: { value: '', error: ''},
            email1: { value: '', error: ''},
            select1: { value: '', error: ''},
            select2: { value: '', error: ''}
        };
        
        const validationCallbacks = {
            text1: this.validateText1
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.formHelper = new FormHelper(this, validationCallbacks);
    }

    validateText1(value) {
        if (value === 'Hello') 
            return 'Can\'t be \'Hello\'';
        return '';
    }
    
    clearForm() {
        this.setState({
            text1: { value: '', error: ''},
            email1: { value: '', error: ''},
            select1: { value: '', error: ''},
            select2: { value: '', error: ''}
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        const { text1, email1, select1, select2 } = this.state;
        const objectItems = [ 
            { text: 'Item 1', value: 'Value 1' },
            { text: 'Item 2', value: 'Value 2' },
            { text: 'Item 3', value: 'Value 3' }
        ];

        return (
            <div>
                <GridRow>
                    <GridCell><h1>Layout test</h1></GridCell>
                </GridRow>
                <form onSubmit={this.handleSubmit}>
                    <GridRow>
                        <GridCell>
                            <SelectField name="select1" label="Select 1" items={['Item 1', 'Item 2', 'Item 3']} placeholder="Select a field" value={select1.value} error={select1.error} formHelper={this.formHelper} required />
                        </GridCell>
                        <GridCell>
                            <InputField name="text1" label="Text 1" placeholder="Text 1" type="text" minLength="3" required value={text1.value} error={text1.error} formHelper={this.formHelper} />
                        </GridCell>
                    </GridRow>
                    <GridRow sizeBreak={ScreenSizes.SCREEN_MINI}>
                        <GridCell>
                            <SelectField name="select2" label="Select 2" items={objectItems} value={select2.value} error={select2.error} formHelper={this.formHelper} />
                        </GridCell>
                        <GridCell>
                            <InputField name="email1" label="Email 1" placeholder="Email" type="email" required value={email1.value} error={email1.error}  formHelper={this.formHelper} />
                        </GridCell>
                    </GridRow>
                    <GridRow>
                        <GridCell>
                            <InputField name="date" label="Date" placeholder="Select a date" type="date" formHelper={this.formHelper} />
                        </GridCell>
                        <GridCell>
                            <InputField name="datetime" label="Date and Time" placeholder="Select" type="datetime" formHelper={this.formHelper} />
                        </GridCell>
                        <GridCell>
                            <InputField name="password" label="Password" placeholder="Password" type="password" formHelper={this.formHelper} />
                        </GridCell>
                    </GridRow>
                    <GridRow>
                        <GridCell>
                            <InputField name="telefone" label="Telefone" placeholder="Numero" type="tel" formHelper={this.formHelper} />
                        </GridCell>
                        <GridCell>
                            <InputField name="number" label="Number" placeholder="Um número" type="number" formHelper={this.formHelper} />
                        </GridCell>
                    </GridRow>
                    <GridRow>
                        <GridCell shrink>
                            <Button caption="Salvar" style={STYLE_DEFAULT} action={ACTION_SUBMIT} />
                        </GridCell>
                        <GridCell>
                            <Button caption="Clear" style={STYLE_DANGER} onClick={this.clearForm} />
                        </GridCell>
                    </GridRow>
                </form>
            </div>
        );
    }
}

export default LayoutTestPage;