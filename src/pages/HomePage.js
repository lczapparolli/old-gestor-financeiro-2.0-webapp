import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Gestor Financeiro 2.0</h1>
            <Link to="/login">Login</Link>
        </div>
    );
}

export default HomePage;