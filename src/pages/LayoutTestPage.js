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
                <GridCell>Cell 1</GridCell>
                <GridCell>Cell 2</GridCell>
                <GridCell>Cell 3</GridCell>
                <GridCell>Cell 4</GridCell>
                <GridCell>Cell 5</GridCell>
                <GridCell>Cell 6</GridCell>
                <GridCell>Cell 7</GridCell>
                <GridCell>Cell 8</GridCell>
            </GridRow>
            <GridRow>
                <GridCell>
                    <GridRow>
                        <GridCell>Cell 1</GridCell>
                        <GridCell>Cell 2</GridCell>
                        <GridCell>Cell 3</GridCell>
                        <GridCell>Cell 4</GridCell>
                    </GridRow>
                </GridCell>
                <GridCell>
                    <GridRow>
                        <GridCell>Cell 5</GridCell>
                        <GridCell>Cell 6</GridCell>
                        <GridCell>Cell 7</GridCell>
                        <GridCell>Cell 8</GridCell>
                    </GridRow>
                </GridCell>
            </GridRow>
            <GridRow>
                <GridCell>
                    <GridRow sizeBreak={ScreenSizes.SCREEN_SMALL}>
                        <GridCell><GridRow><GridCell>Cell 1</GridCell><GridCell>Cell 2</GridCell></GridRow></GridCell>
                        <GridCell><GridRow><GridCell>Cell 2</GridCell><GridCell>Cell 3</GridCell></GridRow></GridCell>
                    </GridRow>
                </GridCell>
                <GridCell>
                    <GridRow sizeBreak={ScreenSizes.SCREEN_SMALL}>
                        <GridCell><GridRow><GridCell>Cell 5</GridCell><GridCell>Cell 6</GridCell></GridRow></GridCell>
                        <GridCell><GridRow><GridCell>Cell 7</GridCell><GridCell>Cell 8</GridCell></GridRow></GridCell>
                    </GridRow>
                </GridCell>
            </GridRow>
            <GridRow>
                <GridCell>
                    <GridRow><GridCell>Cell 1</GridCell></GridRow>
                    <GridRow><GridCell>Cell 2</GridCell></GridRow>
                    <GridRow><GridCell>Cell 3</GridCell></GridRow>
                    <GridRow><GridCell>Cell 4</GridCell></GridRow>
                </GridCell>
                <GridCell>
                    <GridRow><GridCell>Cell 5</GridCell></GridRow>
                    <GridRow><GridCell>Cell 6</GridCell></GridRow>
                    <GridRow><GridCell>Cell 7</GridCell></GridRow>
                    <GridRow><GridCell>Cell 8</GridCell></GridRow>
                </GridCell>
            </GridRow>
            <GridRow>
                <GridCell>Cell 1</GridCell>
                <GridCell>
                    <GridRow>
                        <GridCell>Cell 2</GridCell>
                        <GridCell>
                            <GridRow>
                                <GridCell>Cell 3</GridCell>
                                <GridCell>
                                    <GridRow>
                                        <GridCell>Cell 4</GridCell>
                                        <GridCell>
                                            <GridRow>
                                                <GridCell>Cell 5</GridCell>
                                            </GridRow>
                                        </GridCell>
                                    </GridRow>
                                </GridCell>
                            </GridRow>
                        </GridCell>
                    </GridRow>
                </GridCell>
            </GridRow>
        </div>
    );
}

export default LayoutTestPage;