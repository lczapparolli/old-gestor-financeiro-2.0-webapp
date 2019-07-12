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

    async componentDidMount() {
        const movementList = await movementsController.findAll();
        this.setState({ loading: false, movementList });
    }

    handleDeleteClick = async movement => {
        if (window.confirm('Delete movement "' + movement.description + '"?')) {
            await movementsController.deleteMovement(movement.id);
            const movementList = await movementsController.findAll();
            this.setState({ movementList });
        }
    };

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
    movements: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        account: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }).isRequired,
        forecast: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }).isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        value: PropTypes.number.isRequired
    })).isRequired,
    onDeleteClick: PropTypes.func.isRequired
};

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
    movement: PropTypes.shape({
        id: PropTypes.number.isRequired,
        account: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }).isRequired,
        forecast: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }).isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        value: PropTypes.number.isRequired
    }).isRequired,
    onDeleteClick: PropTypes.func.isRequired
};

export default Movements;
export { MovementsList, Movement };