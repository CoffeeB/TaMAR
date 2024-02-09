import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({username: username, password: password}),
            });
            if (!response.ok) {
                throw new Error('Invalid Details');
            }
            const userData = await response.json();
            const loggedInUsername = userData.username;
            onLogin(loggedInUsername);
            navigate('/');
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <h1 className="title">Login</h1>
            <form className="add-form" onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="username">username</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">password</label>
                    <input type="text" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <input type="submit" value="Login" className="btn btn-block" />
                <div className="below-btn">
                    {error && <p>{error}</p>}
                    <Link className="link" to="/signup">Create an account</Link>
                </div>
            </form>
        </div>
    )
}

export default Login;