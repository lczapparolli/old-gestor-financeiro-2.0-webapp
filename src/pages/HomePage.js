import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Gestor Financeiro 2.0</h1>
            <Link to="/login">Login</Link> or <Link to="/test">Test</Link>
        </div>
    );
}

export default HomePage;