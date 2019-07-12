//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { shallow, mount } from 'enzyme';
//Tested module
import Movements, { MovementsList, Movement } from '../Movements';
import formatNumber from '../../helpers/FormatNumber';
import formatDate from '../../helpers/FormatDate';
import db from '../../db';
import movementsController from '../../controllers/MovementsController';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
let movements = [
    { id: 1, accountId: 1, forecastId: 1, value: 10, date: new Date(Date.now()), description: 'Test movement', account: { id: 1, name: 'Test account'}, forecast: { id: 1, name: 'Test forecast'} },
    { id: 1, accountId: 1, forecastId: 1, value: 20, date: new Date(Date.now()), description: 'Test movement 2', account: { id: 1, name: 'Test account'}, forecast: { id: 1, name: 'Test forecast'} }
];

describe('Movements component', () => {
    let component;
    
    beforeAll(async () => {
        //Initializing component
        component = shallow(<Movements />);
        //Wait component to be fully mounted
        await component.instance().componentDidMount();
    });

    describe('Component structure', () => {
        it('renders a title, a movements list and a link to add new movements', () => {
            cExpect(component).to.have.descendants('h2');
            cExpect(component).to.have.descendants('Link');
            cExpect(component.find('Link')).to.have.prop('to', '/movements/new');
            cExpect(component).to.have.descendants('MovementsList');
            //Pass the handler to movement list
            cExpect(component.find('MovementsList')).to.have.prop('onDeleteClick', component.instance().handleDeleteClick);
        });
    });
});

describe('MovementsList component', () => {
    let component;
    const handleDeleteClick = () => {};
    
    beforeAll(async () => {
        //Initializing component
        component = shallow(<MovementsList movements={movements} onDeleteClick={handleDeleteClick} />);
    });

    it('renders a table and a list of movements', () => {
        cExpect(component).to.have.descendants('table');
    });
        
    it('has 6 columns into table', () => {
        const columns = component.find('thead > tr > th');
        cExpect(columns).to.have.length(6);
        cExpect(columns.at(0)).to.have.text('Description');
        cExpect(columns.at(1)).to.have.text('Account');
        cExpect(columns.at(2)).to.have.text('Budget');
        cExpect(columns.at(3)).to.have.text('Date');
        cExpect(columns.at(4)).to.have.text('Value');
        cExpect(columns.at(5)).to.have.text('Delete');
    });

    it('has one line per movement into database', () => {
        const rows = component.find('Movement');
        cExpect(rows).to.have.length(movements.length);
        //Pass the prop to children
        cExpect(rows.at(0)).to.have.prop('onDeleteClick', handleDeleteClick);
    });
});

describe('Movement component', () => {
    let component;
    let movement;
    
    beforeAll(async () => {
        movement = movements[0];
        //Initializing component
        component = shallow(<Movement movement={movement} onDeleteClick={() => {}} />);
    });
    
    it('renders a table with 6 columns', () => {
        const columns = component.find('td');
        cExpect(columns).to.have.length(6);
        
        cExpect(columns.at(0)).to.have.descendants('Link');
        cExpect(columns.at(0).find('Link')).to.have.prop('to', '/movements/' + movement.id.toString());
        cExpect(columns.at(0).find('Link')).to.have.text(movement.text);
        
        cExpect(columns.at(1)).to.have.text(movement.account.name);
        cExpect(columns.at(2)).to.have.text(movement.forecast.name);
        cExpect(columns.at(3)).to.have.text(formatDate(movement.date));
        cExpect(columns.at(4)).to.have.text(formatNumber(movement.value, 'R$'));
        cExpect(columns.at(5)).to.have.descendants('Button');
        cExpect(columns.at(5).find('Button')).to.have.prop('caption', 'Delete');
    });
});

describe('Delete action', () => {
    //Test data
    const account = { name: 'Test account', balance: 0, type: 'checking'};
    const forecast = { name: 'Test account', amount: 0, categoryId: 0};
    const movementTest = { accountId: 0, forecastId: 0, value: 10, date: Date.now(), description: 'Test movement' };
    
    beforeAll(async () => {
        await db.accounts.clear();
        await db.forecasts.clear();
        await db.movements.clear();
        
        //Grants that an account and a forecasts exists
        const categories = await db.forecasts_categories.toArray();
        forecast.categoryId = categories[0].id;

        account.id = await db.accounts.put(account);
        forecast.id = await db.forecasts.put(forecast);
        movementTest.accountId = account.id;
        movementTest.forecastId = forecast.id;
    });

    it('calls onDeleteClick event when button is pressed', done => {
        //Tested movement
        const movement = movements[0];
        //Mocked handler
        const mockDelete = deletedMovement => {
            //Testing movement Id
            cExpect(deletedMovement).to.have.property('id', movement.id);
            done();
        };
        //Initializing component
        const component = mount(
            <MemoryRouter>
                <table>
                    <tbody>
                        <Movement movement={movement} onDeleteClick={mockDelete} />
                    </tbody>
                </table>
            </MemoryRouter>
        );
        //Simulate button click
        component.find('Button').simulate('click');
    });

    it('deletes a movement when button is pressed and the user confirms the action', async () => {
        //Mocking window.confirm
        window.confirm = (message) => {
            cExpect(message).to.contain(movementTest.description);
            return true;
        };

        //Initializing DB
        const insertedMovement = await movementsController.saveMovement(movementTest);

        //Checks if it was inserted
        let movementList = await db.movements.toArray();
        cExpect(movementList).to.have.length(1);

        //Initializing component
        const component = shallow(<Movements />);
        await component.instance().componentDidMount();
        await component.instance().handleDeleteClick(insertedMovement);

        //Checks db again
        movementList = await db.movements.toArray();
        cExpect(movementList).to.have.length(0);
    });

    it('does not delete a movement when user cancel the action', async () => {
        //Mocking window.confirm
        window.confirm = () => false;

        //Initializing DB
        const insertedMovement = await movementsController.saveMovement(movementTest);

        //Checks if it was inserted
        let movementList = await db.movements.toArray();
        cExpect(movementList).to.have.length(1);

        //Initializing component
        const component = shallow(<Movements />);
        await component.instance().componentDidMount();
        await component.instance().handleDeleteClick(insertedMovement);

        //Checks db again
        movementList = await db.movements.toArray();
        cExpect(movementList).to.have.length(1);
    });
});