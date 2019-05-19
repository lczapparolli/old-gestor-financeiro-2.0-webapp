//Libs
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import { shallow } from 'enzyme';
//Tested module
import Movements, { MovementsList } from '../Movements';
import accountsController from '../../controllers/AccountsController';
import forecastsCategoriesController from '../../controllers/ForecastsCategoriesController';
import forecastsController from '../../controllers/ForecastsController';
import movementsController from '../../controllers/MovementsController';
import formatNumber from '../../helpers/FormatNumber';
import formatDate from '../../helpers/FormatDate';

chai.use(chaiEnzyme());
const cExpect = chai.expect;

//Test data
let account = { id: 0, name: 'Test account', type: 'checking' };
let forecastCategory = { id: 0, name: 'Test category' };
let forecast = { id: 0, name: 'Test forecast', amount: 0 };
let movement = { accountId: 0, forecastId: 0, value: 10, date: Date.now(), description: 'Test movement' };

describe('Movements component', () => {
    let component;
    
    beforeAll(async () => {
        //Initializing component
        component = shallow(<Movements />);
    });

    describe('Component structure', () => {
        it('renders a title, a movements list and a form', () => {
            cExpect(component).to.have.descendants('h2');
            cExpect(component).to.have.descendants('MovementsList');
        });
    });
});

describe('MovementsList component', () => {
    let component;
    
    beforeAll(async () => {
        //Insert test data
        account = await accountsController.saveAccount(account);
        forecastCategory = await forecastsCategoriesController.saveCategory(forecastCategory);
        forecast.categoryId = forecastCategory.id;
        forecast = await forecastsController.saveForecast(forecast);
        movement.forecastId = forecast.id;
        movement.accountId = account.id;
        movement = await movementsController.saveMovement(movement);
        //Initializing component
        component = shallow(<MovementsList />);
        //Wait component to be fully mounted
        await component.instance().componentDidMount();
    });

    it('renders a table', () => {
        cExpect(component).to.have.descendants('table');
    });
        
    it('has 5 columns into table', () => {
        const columns = component.find('thead > tr > th');
        cExpect(columns).to.have.length(5);
        cExpect(columns.at(0)).to.have.text('Budget');
        cExpect(columns.at(1)).to.have.text('Description');
        cExpect(columns.at(2)).to.have.text('Date');
        cExpect(columns.at(3)).to.have.text('Value');
        cExpect(columns.at(4)).to.have.text('Account');
    });

    it('has one line per movement into database', () => {
        const rows = component.find('tbody > tr');
        cExpect(rows).to.have.length(1);
        const columns = rows.at(0).find('td');
        cExpect(columns).to.have.length(5);
        cExpect(columns.at(0)).to.have.text(forecast.name);
        cExpect(columns.at(1)).to.have.text(movement.description);
        cExpect(columns.at(2)).to.have.text(formatDate(movement.date));
        cExpect(columns.at(3)).to.have.text(formatNumber(movement.value, 'R$'));
        cExpect(columns.at(4)).to.have.text(account.name);
    });
});