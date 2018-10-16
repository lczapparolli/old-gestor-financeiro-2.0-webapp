//External libraries
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//Pages
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="container">
                    <Route exact path="/" component={HomePage} />
                    <Route path="/login" component={LoginPage} />
                </div>
            </Router>
        );
    }
}

export default App;
