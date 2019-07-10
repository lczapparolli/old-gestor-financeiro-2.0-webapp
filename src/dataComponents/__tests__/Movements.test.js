//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import Movements, { MovementsList, Movement } from '../Movements';
import formatNumber from '../../helpers/FormatNumber';
import formatDate from '../../helpers/FormatDate';

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
        });
    });
});

describe('MovementsList component', () => {
    let component;
    
    beforeAll(async () => {
        //Initializing component
        component = shallow(<MovementsList movements={movements} />);
    });

    it('renders a table and a list of movements', () => {
        cExpect(component).to.have.descendants('table');
    });
        
    it('has 5 columns into table', () => {
        const columns = component.find('thead > tr > th');
        cExpect(columns).to.have.length(5);
        cExpect(columns.at(0)).to.have.text('Description');
        cExpect(columns.at(1)).to.have.text('Account');
        cExpect(columns.at(2)).to.have.text('Budget');
        cExpect(columns.at(3)).to.have.text('Date');
        cExpect(columns.at(4)).to.have.text('Value');
    });

    it('has one line per movement into database', () => {
        const rows = component.find('Movement');
        cExpect(rows).to.have.length(movements.length);
    });
});

describe('Movement component', () => {
    let component;
    let movement;
    
    beforeAll(async () => {
        movement = movements[0];
        //Initializing component
        component = shallow(<Movement movement={movement} />);
    });
    it('renders a table with 5 columns', () => {
        const columns = component.find('td');
        cExpect(columns).to.have.length(5);
        
        cExpect(columns.at(0)).to.have.descendants('Link');
        cExpect(columns.at(0).find('Link')).to.have.prop('to', '/movements/' + movement.id.toString());
        cExpect(columns.at(0).find('Link')).to.have.text(movement.text);
        
        cExpect(columns.at(1)).to.have.text(movement.account.name);
        cExpect(columns.at(2)).to.have.text(movement.forecast.name);
        cExpect(columns.at(3)).to.have.text(formatDate(movement.date));
        cExpect(columns.at(4)).to.have.text(formatNumber(movement.value, 'R$'));
    });
});