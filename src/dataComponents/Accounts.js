//Libs
import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//Style
import '../style/DataComponent.scss';
//Controller
import accountsController from '../controllers/AccountsController';
//Components
import GridRow from '../components/GridRow';
import GridCell from '../components/GridCell';
//Helpers
import formatNumber from '../helpers/FormatNumber';

/**
 * Component to list accounts with different types and sum the balance
 */
class Accounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: {},
            loading: true
        };
    }

    async componentDidMount() {
        const groups = await accountsController.findAll();
        this.setState({ groups, loading: false });
    }

    render() {
        const { groups, loading } = this.state;
        if (loading) return <h1>Loading</h1>;

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
                        <table className="DataComponent" >
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th className="NumberField">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AccountCategory title="Accounts" accounts={groups.checking.items} sum={groups.checking.sum} />
                                <AccountCategory title="Credit Cards" accounts={groups.credit.items} sum={groups.credit.sum} />
                                <AccountCategory title="Investments" accounts={groups.savings.items} sum={groups.savings.sum} />
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
}

/**
 * Show a account category and list the respective accounts with a sub-total
 */
function AccountCategory({ title, accounts, sum }) {
    const list = accounts.map((account, index) => <Account key={index} account={account} />);

    return (
        <Fragment>
            <tr className="CategoryHeader">
                <th colSpan="2">{title}</th>
            </tr>
            {list}
            <tr className="CategoryTotal">
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
