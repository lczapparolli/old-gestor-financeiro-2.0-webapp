//Libs
import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Controller
import movementsController from '../controllers/MovementsController';
//Form
import MovementForm from '../forms/MovementForm';

class MovementPage extends Component {
    constructor(props) {
        super(props);
        //Initial state
        this.state = {
            success: false
        };
    }

    handleSubmit = async movement => {
        await movementsController.saveMovement(movement);
        this.setState({ success: true });
    }

    render() {
        const { success } = this.state;

        if (success)
            return <Redirect to="/dashboard" />;

        return (
            <Fragment>
                <GridRow>
                    <GridCell>
                        <h1>Movements</h1>
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <MovementForm onSubmit={this.handleSubmit} />
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <Link to="/dashboard">Back</Link>
                    </GridCell>
                </GridRow>
            </Fragment>
        );
    }
}

export default MovementPage;