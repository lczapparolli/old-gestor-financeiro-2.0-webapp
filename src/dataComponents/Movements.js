//Libs
import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
import MovementsController from '../controllers/MovementsController';
import formatNumber from '../helpers/FormatNumber';
import formatDate from '../helpers/FormatDate';

function Movements() {
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
                    <MovementsList />
                </GridCell>
            </GridRow>
        </Fragment>
    );
}

class MovementsList extends Component {
    constructor(props) {
        super(props);
        //bindings
        this.renderMovements = this.renderMovements.bind(this);
        //Initial state
        this.state = {
            loading: true,
            /** @type {Array<import('../controllers/MovementsController').Movement>} */
            movementList: []
        };
    }

    async componentDidMount() {
        const movementList = await MovementsController.findAll();
        this.setState({ loading: false, movementList });
    }

    renderMovements(movementList) {
        return movementList.map(movement => {
            const movementLink = '/movements/' + movement.id;
            return (
                <tr key={movement.id}>
                    <td><Link to={movementLink}>{movement.description}</Link></td>
                    <td>{movement.account.name}</td>
                    <td>{movement.forecast.name}</td>
                    <td>{formatDate(movement.date)}</td>
                    <td>{formatNumber(movement.value, 'R$')}</td>
                </tr>
            );
        });
    }

    render() {
        const { loading, movementList } = this.state;
        if (loading)
            return (<h2>Loading</h2>);

        const movementsComponents = this.renderMovements(movementList);

        return (
            <table className="DataComponent" >
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Account</th>
                        <th>Budget</th>
                        <th>Date</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {movementsComponents}
                </tbody>
            </table>        
        );
    }
}

export default Movements;
export {MovementsList};