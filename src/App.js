//Libs
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//Components
import Container from './components/Container';
//Pages
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import LayoutTestPage from './pages/LayoutTestPage';

class App extends Component {
    render() {
        return (
            <Router>
                <Container>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/test" component={LayoutTestPage} />
                </Container>
            </Router>
        );
    }
}

export default App;
