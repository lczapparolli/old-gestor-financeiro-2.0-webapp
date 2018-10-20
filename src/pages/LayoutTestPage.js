//Libs
import React from 'react';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Helpers
import ScreenSizes from '../helpers/ScreenSizes';

function LayoutTestPage() {
    return (
        <div>
            <GridRow>
                <GridCell><h1>Layout test</h1></GridCell>
            </GridRow>
            <GridRow>
                <GridCell>
                    <GridRow sizeBreak={ScreenSizes.SCREEN_MEDIUM}>
                        <GridCell><span>Cell 1</span></GridCell>
                        <GridCell><span>Cell 2</span></GridCell>
                        <GridCell><span>Cell 3</span></GridCell>
                    </GridRow>
                </GridCell>
                <GridCell>
                    <GridRow sizeBreak={ScreenSizes.SCREEN_MINI}>
                        <GridCell><span>Cell 4</span></GridCell>
                        <GridCell><span>Cell 5</span></GridCell>
                        <GridCell><span>Cell 6</span></GridCell>
                    </GridRow>
                </GridCell>
            </GridRow>
            <GridRow>
                <GridCell shrink noWrap><span>Cell 1</span></GridCell>
                <GridCell><span>Cell 2</span></GridCell>
                <GridCell shrink noWrap><span>Cell 3</span></GridCell>
                <GridCell shrink noWrap><span>Cell 4</span></GridCell>
            </GridRow>
            <GridRow>
                <GridCell><span>Cell 1</span></GridCell>
            </GridRow>
            <GridRow sizeBreak={ScreenSizes.SCREEN_SMALL}>
                <GridCell><span>Cell 1</span></GridCell>
                <GridCell shrink noWrap><span>Cell 2</span></GridCell>
            </GridRow>
        </div>
    );
}

export default LayoutTestPage;