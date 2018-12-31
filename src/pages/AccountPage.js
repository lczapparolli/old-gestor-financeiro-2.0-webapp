//Libs
import React from 'react';
import { Link } from 'react-router-dom';

function AccountPage() {
    return (
        <div>
            <h1>Account</h1>
            <Link to="/dashboard">Back</Link>
        </div>
    );
}

export default AccountPage;