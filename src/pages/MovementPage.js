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
import Movement from '../models/Movement';

class MovementPage extends Component {
    constructor(props) {
        super(props);
        //Static data
        this.movementId = this.getId();
        //Initial state
        this.state = {
            success: false,
            loading: true,
            movement: new Movement(0, 0, '', 0, new Date(Date.now()))
        };
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

    async componentDidMount() {
        let movement = new Movement(0, 0, '', 0, new Date(Date.now()));
        if (this.movementId > 0) {
            movement = await movementsController.getById(this.movementId);
        }
        this.setState({ loading: false, movement });
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
    /** URL query data */
    location: PropTypes.shape({ search:PropTypes.string }),
    /** Match object to get URL parameters */
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) })
};

export default MovementPage;