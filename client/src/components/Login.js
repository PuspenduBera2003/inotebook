import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './css/Login.css'
import AlertContext from '../context/alert/AlertContext'
import UserContext from '../context/user/UserContext'

const Login = (props) => {
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    let navigate = useNavigate();

    const context = useContext(AlertContext);

    const { setAlertMessage } = context;
    const userContext = useContext(UserContext);

    const { fetchUserdetails } = userContext;

    const [passwordFieldState, setPasswordFieldState] = useState({
        password: false,
    });

    function togglePassword(inputId) {
        // Create a copy of the state object
        const updatedState = { ...passwordFieldState };
        // Toggle the state for the corresponding input ID
        updatedState[inputId] = !updatedState[inputId];
        // Update the state with the modified object
        setPasswordFieldState(updatedState);
    }

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
            localStorage.setItem('iNotebookToken', json.authToken);
            fetchUserdetails();
            navigate("/");

        }
        else {
            setAlertMessage("Please login with correct credentials", "danger")
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='container my-3' style={{ maxWidth: '30rem' }}>
            <h4 className="card-header mb-4 text-center">Login to continue to iNotebook</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" value={credentials.username} onChange={onChange} id="username" name="username" minLength={5} required />
                </div>
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group mb-3">
                    <input
                        type={passwordFieldState.password ? "text" : "password"}
                        className="form-control"
                        value={credentials.password}
                        onChange={onChange}
                        id="password"
                        name="password"
                        minLength={8}
                        required 
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => togglePassword('password')}
                    >
                        {passwordFieldState.password ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                    </button>
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