import React, { Component } from 'react';

class LoginPage extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            senha: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit() {
    }

    render() {
        return (
            <div className="content">
                <h1>Log in</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="inputField">
                        <label htmlFor="email">Email</label>
                        <input name="email" id="email" type="email" value={this.state.email} onChange={this.handleChange} />
                    </div>
                    <div className="inputField">
                        <label htmlFor="password">Password</label>
                        <input name="password" id="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <input type="submit" value="Login" />
                </form>
            </div>
        );
    }
}

export default LoginPage;