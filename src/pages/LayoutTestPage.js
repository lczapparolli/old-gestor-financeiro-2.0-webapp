//Libs
import React from 'react';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import InputField from '../components/InputField';
//Helpers
import ScreenSizes from '../helpers/ScreenSizes';
import FormHelper from '../helpers/FormHelper';

class LayoutTestPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text1: { value: '', error: ''}
        };
        
        const validationCallbacks = {
            text1: this.validateText1
        };
        
        this.formHelper = new FormHelper(this, validationCallbacks);
    }

    validateText1(value) {
        if (value === 'Hi') 
            return 'Can\'t be \'Hi\'';
        return '';
    }
    

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        const { text1 } = this.state;

        return (
            <div>
                <GridRow>
                    <GridCell><h1>Layout test</h1></GridCell>
                </GridRow>
                <form onSubmit={this.handleSubmit} >
                    <GridRow sizeBreak={ScreenSizes.SCREEN_MINI}>
                        <GridCell>
                            <InputField name="text1" label="Text 1" placeholder="Text 1" type="text" required value={text1.value} error={text1.error} formHelper={this.formHelper} />
                        </GridCell>
                        <GridCell>
                            <InputField name="email1" label="Email 1" placeholder="Email" type="email" required formHelper={this.formHelper} />
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
                        <GridCell>
                            <button>Button</button>
                        </GridCell>
                    </GridRow>
                </form>
            </div>
        );
    }
}

export default LayoutTestPage;