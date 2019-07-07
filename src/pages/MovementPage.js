//Libs
import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Controller
import movementsController from '../controllers/MovementsController';
//Helpers
import { convertToNumber } from '../helpers/ConvertToNumber';
//Form
import MovementForm from '../forms/MovementForm';

class MovementPage extends Component {
    constructor(props) {
        super(props);
        //Static data
        this.movementId = this.getId();
        //Initial state
        this.state = {
            success: false,
            loading: true,
            movement: {}
        };
    }

    componentDidMount = async() => {
        let movement = { description: '', forecastId: 0, accountId: 0, value: 0, date: Date.now() };
        if (this.movementId > 0) {
            movement = await movementsController.getById(this.movementId);
        }
        this.setState({ loading: false, movement });
    }

    getId = () => {
        if (this.props.match.params.id !== 'new')
            return convertToNumber(this.props.match.params.id);
        else
            return 0;
    }

    handleSubmit = async movement => {
        if (this.movementId > 0)
            movement.id = this.movementId;
        await movementsController.saveMovement(movement);
        this.setState({ success: true });
    }

    render() {
        const { success, loading, movement } = this.state;

        if (success)
            return <Redirect to="/dashboard" />;
        if (loading)
            return <h1>Loading</h1>;

        return (
            <Fragment>
                <GridRow>
                    <GridCell>
                        <h1>Movements</h1>
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <MovementForm onSubmit={this.handleSubmit} movement={movement} />
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

MovementPage.propTypes = {
    location: PropTypes.shape({ search:PropTypes.string }),
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) })
};

export default MovementPage;