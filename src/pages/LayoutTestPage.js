//Libs
import React from 'react';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import InputField from '../components/InputField';
//Helpers
import ScreenSizes from '../helpers/ScreenSizes';

function LayoutTestPage() {
    return (
        <div>
            <GridRow>
                <GridCell><h1>Layout test</h1></GridCell>
            </GridRow>
            <form>
                <GridRow sizeBreak={ScreenSizes.SCREEN_MINI}>
                    <GridCell>
                        <InputField name="input1" label="Input 1" placeholder="Input 1" />
                    </GridCell>
                    <GridCell noWrap>
                        <InputField name="input2" label="Input 2" placeholder="Input 2" />
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <InputField name="input3" label="Input 3" placeholder="Input 3" />
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

export default LayoutTestPage;