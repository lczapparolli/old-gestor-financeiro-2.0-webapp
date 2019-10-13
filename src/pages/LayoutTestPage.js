//Libs
import React from 'react';
//Components
import DateNavigator from '../components/DateNavigator';
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';

class LayoutTestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            month: 9,
            year: 2019
        };
    }

    handleNavigatorChange = ({ month, year }) => {
        console.log({ month, year });
        this.setState({ month, year });
    }

    render() {
        return (
            <div>
                <GridRow>
                    <GridCell><h1>Layout test</h1></GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <DateNavigator month={this.state.month} year={this.state.year} onChange={this.handleNavigatorChange} />
                    </GridCell>
                </GridRow>
            </div>
        );
    }
}

export default LayoutTestPage;