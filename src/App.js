//Libs
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//Components
import Container from './components/Container';
import ConditionalRoute from './components/ConditionalRoute';
//Controllers
import loginController from './controllers/LoginController';
//Pages
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import Dashboard from './pages/Dashboard';
import LayoutTestPage from './pages/LayoutTestPage';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            logged: false
        };
    }

    async componentDidMount() {
        const logged = await loginController.isLogged();
        this.setState({ loading: false, logged });
    }

    render() {
        const { loading, logged } = this.state;
        if (loading) return <h1>Loading</h1>;
        return (
            <Router>
                <Container>
                    <ConditionalRoute exact path="/" component={HomePage} condition={!logged} redirect="/dashboard" />
                    <ConditionalRoute path="/login" component={LoginPage} condition={!logged} redirect="/dashboard" />
                    <ConditionalRoute path="/dashboard" component={Dashboard} condition={logged} redirect="/login" />
            
                    <Route path="/test" component={LayoutTestPage} />
                </Container>
            </Router>
        );
    }
}

export default App;
