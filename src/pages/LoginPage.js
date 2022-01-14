import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'react-bootstrap';
import { loginUser } from '../utils';

export default function Login({ setToken }) {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [rememberme, setRememberMe] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password,
            rememberme
        });
        if (token) {
            localStorage.setItem('token', token.access_token);
            setToken(token.access_token);
        }
    }

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col>
                    <div className="login-wrapper">
                        <form onSubmit={handleSubmit}>

                            <h3>Log in</h3>

                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" className="form-control" placeholder="Enter username" onChange={e => setUserName(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="customCheck1" onChange={e => setRememberMe(e.target.checked)} />
                                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-dark btn-lg btn-block">Sign in</button>
                            {/* <p className="forgot-password text-right">
                                Forgot <a href="#"> password?</a>
                            </p> */}
                        </form>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};