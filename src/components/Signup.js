import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!username || !password) {
                throw new Error('Fill in Details');
            }
            const response = await fetch('http://localhost:4000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({username,password}),
            });
            if (!response.ok) {
                throw new Error('Username already exists');
            }
            navigate('/login');
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <h1 className="title">Create An Account</h1>
            <form className="add-form" onSubmit={handleSubmit}>
                <div className="form-control">
                    <label>Email</label>
                    <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-control">
                    <label>password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <input type="submit" value="Signup" className="btn btn-block" />
                <div className="below-btn">
                    {error && <p id="errorField">{error}</p>}
                    <Link className="link" to="/login">Login to account</Link>
                </div>
            </form>
        </div>
    )
}

export default Signup;
