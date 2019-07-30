//Libs
import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import Button from '../components/Button';
//Controllers
import movementsController from '../controllers/MovementsController';
//Helpers
import formatNumber from '../helpers/FormatNumber';
import formatDate from '../helpers/FormatDate';

/**
 * Show a list of movements, provide a link to add new ones and a delete button to remove existent
 */
class Movements extends Component {
    constructor(props) {
        super(props);
        //Initial state
        this.state = {
            loading: true,
            /** @type {Array<import('../controllers/MovementsController').Movement>} */
            movementList: []
        };
    }

    handleDeleteClick = async (movement) => {
        if (window.confirm('Delete movement "' + movement.description + '"?')) {
            await movementsController.deleteMovement(movement.id);
            const movementList = await movementsController.findAll();
            this.setState({ movementList });
        }
    };

    async componentDidMount() {
        const movementList = await movementsController.findAll();
        this.setState({ loading: false, movementList });
    }

    render() {
        const { loading, movementList } = this.state;
        
        if (loading)
            return (<h2>Loading</h2>);
        
        return (
            <Fragment>
                <GridRow>
                    <GridCell>
                        <h2>Movements</h2>
                    </GridCell>
                    <GridCell shrink>
                        <Link to="/movements/new">+</Link>
                    </GridCell>
                </GridRow>
                <GridRow>
                    <GridCell>
                        <MovementsList movements={movementList} onDeleteClick={this.handleDeleteClick} />
                    </GridCell>
                </GridRow>
            </Fragment>
        );
    }
}

/**
 * Renders a list of movements
 */
function MovementsList({ movements, onDeleteClick }) {
    const movementsComponents = movements.map(movement => <Movement key={movement.id} movement={movement} onDeleteClick={onDeleteClick} />);

    return (
        <table className="DataComponent" >
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Account</th>
                    <th>Budget</th>
                    <th>Date</th>
                    <th>Value</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {movementsComponents}
            </tbody>
        </table>        
    );
}

MovementsList.propTypes = {
    /** List of movements to be shown */
    movements: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        account: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }).isRequired,
        forecast: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }).isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        value: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired
    })).isRequired,
    /** Callback function to be fired when user press delete button */
    onDeleteClick: PropTypes.func.isRequired
};

/**
 * Show a movement object with a button to delete itself
 */
function Movement({ movement, onDeleteClick }) {
    const movementLink = '/movements/' + movement.id;
    return (
        <tr key={movement.id}>
            <td><Link to={movementLink}>{movement.description}</Link></td>
            <td>{movement.account.name}</td>
            <td>{movement.forecast.name}</td>
            <td>{formatDate(movement.date)}</td>
            <td>{formatNumber(movement.value, 'R$')}</td>
            <td><Button caption="Delete" onClick={() => onDeleteClick(movement)} /></td>
        </tr>
    );
}

Movement.propTypes = {
    /** Movement object to be shown */
    movement: PropTypes.shape({
        id: PropTypes.number.isRequired,
        account: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }).isRequired,
        forecast: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }).isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        value: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired,
    /** Callback function to be fired when user press delete button */
    onDeleteClick: PropTypes.func.isRequired
};

export default Movements;
export { MovementsList, Movement };