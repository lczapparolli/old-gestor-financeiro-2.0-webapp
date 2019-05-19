//Libs
import React, { Fragment, Component } from 'react';
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
        return movementList.map(movement => (
            <tr key={movement.id}>
                <td>{movement.forecast.name}</td>
                <td>{movement.description}</td>
                <td>{formatDate(movement.date)}</td>
                <td>{formatNumber(movement.value, 'R$')}</td>
                <td>{movement.account.name}</td>
            </tr>
        ));
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
                        <th>Budget</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Value</th>
                        <th>Account</th>
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