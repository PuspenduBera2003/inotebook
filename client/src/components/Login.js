import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './css/Login.css'

const Login = (props) => {
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = process.env.REACT_APP_SERVER_URL_FOR_LOGIN
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: credentials.username, password: credentials.password })
        });
        const json = await response.json()
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            navigate("/");

        }
        else {
            alert("Invalid credentials");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='container my-3' style={{ maxWidth: '30rem' }}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" value={credentials.username} onChange={onChange} id="username" name="username" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" minLength={8} required />
                </div>

                <button type="submit" className="btn btn-primary">
                   <i className="fa-solid fa-right-to-bracket"></i>
                </button>
            </form>
            <div className="container mt-3 mx-0">
                <p className="text-muted d-inline me-2">Don't have an account?</p>
                <Link className="d-inline text-decoration-underline text-dark" id='signup' to='/signup'>Signup Now</Link>
            </div>
        </div>
    )
}

export default Login