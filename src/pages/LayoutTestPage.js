//Libs
import React from 'react';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';

function LayoutTestPage() {
    return (
        <div>
            <GridRow>
                <GridCell><h1>Layout test</h1></GridCell>
            </GridRow>
            <GridRow>
                <GridCell><span>Cell 1</span></GridCell>
                <GridCell><span>Cell 2</span></GridCell>
                <GridCell><span>Cell 3</span></GridCell>
                <GridCell><span>Cell 4</span></GridCell>
                <GridCell><span>Cell 5</span></GridCell>
                <GridCell><span>Cell 6</span></GridCell>
            </GridRow>
            <GridRow>
                <GridCell><span>Cell 1</span></GridCell>
                <GridCell><span>Cell 2</span></GridCell>
                <GridCell><span>Cell 3</span></GridCell>
                <GridCell><span>Cell 4</span></GridCell>
            </GridRow>
            <GridRow>
                <GridCell><span>Cell 1</span></GridCell>
            </GridRow>
            <GridRow>
                <GridCell><span>Cell 1</span></GridCell>
                <GridCell><span>Cell 2</span></GridCell>
            </GridRow>
        </div>
    );
}

export default LayoutTestPage;