//Libs
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//Style
import '../style/Account.scss';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Helpers
import formatNumber from '../helpers/FormatNumber';

/**
 * Component to list accounts with different types and sum the balance
 */
function Accounts() {
    //Mocked data
    const accounts = [
        { id: 1, name: 'BB - Carol', balance: 6.20, type: 'account' },
        { id: 2, name: 'BB - Luis', balance: 26.54, type: 'account' },
        { id: 3, name: 'Bradesco - Luis', balance: 1041.62, type: 'account' },
        { id: 4, name: 'Dinheiro', balance: 63.00, type: 'account' },

        { id: 5, name: 'Poupança BB - Luis', balance: 3027.68, type: 'invest' },

        { id: 6, name: 'Crédito BB', balance: -1639.90, type: 'cc' },
        { id: 7, name: 'Crédito Santander', balance: -1440.93, type: 'cc' }
    ];

    let groups = {
        total: 0,
        account: { items: [], sum: 0 },
        cc: { items: [], sum: 0 },
        invest: { items: [], sum: 0 }
    };

    groups = accounts.reduce((group, account) => {
        group[account.type].items.push(account);
        group[account.type].sum += account.balance;
        group.total += account.balance;
        return group;
    }, groups);

    return (
        <Fragment>
            <GridRow>
                <GridCell>
                    <h2>Accounts</h2>
                </GridCell>
                <GridCell shrink>
                    <Link to="/accounts/new">+</Link>
                </GridCell>
            </GridRow>
            <GridRow>
                <GridCell>
                    <table className="Accounts" >
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className="NumberField">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AccountCategory title="Accounts" accounts={groups.account.items} sum={groups.account.sum} />
                            <AccountCategory title="Credit Cards" accounts={groups.cc.items} sum={groups.cc.sum} />
                            <AccountCategory title="Investments" accounts={groups.invest.items} sum={groups.invest.sum} />
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total</th>
                                <th className="NumberField">{formatNumber(groups.total, 'R$')}</th>
                            </tr>
                        </tfoot>
                    </table>
                </GridCell>
            </GridRow>
        </Fragment>
    );
}

/**
 * Show a account category and list the respective accounts with a sub-total
 */
function AccountCategory({ title, accounts, sum }) {
    const list = accounts.map((account, index) => <Account key={index} account={account} />);

    return (
        <Fragment>
            <tr className="AccountCategoryHeader">
                <th colSpan="2">{title}</th>
            </tr>
            {list}
            <tr className="AccountCategoryTotal">
                <td>Sub-total</td>
                <td className="NumberField">{formatNumber(sum, 'R$')}</td>
            </tr>
        </Fragment>
    );
}

AccountCategory.propTypes = {
    /** Category title */
    title: PropTypes.string.isRequired,
    /** Account list */
    accounts: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number, name: PropTypes.string, balance: PropTypes.number })).isRequired,
    /** Sum of the accounts of the category */
    sum: PropTypes.number.isRequired
};

AccountCategory.defaultProps = {
    title: '',
    accounts: [],
    sum: 0
};

/**
 * Show a single account
 */
function Account({ account }) {
    const accountLink = '/accounts/' + account.id;
    return (
        <tr className="Account">
            <td><Link to={accountLink} >{account.name}</Link></td>
            <td className="NumberField">{formatNumber(account.balance, 'R$')}</td>
        </tr>
    );
}

Account.propTypes = {
    /** Account object with name and balance */
    account: PropTypes.shape({ id: PropTypes.number, name: PropTypes.string, balance: PropTypes.number })
};

export default Accounts;
export { AccountCategory, Account};