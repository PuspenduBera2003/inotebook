import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertContext from '../context/alert/AlertContext'

const Signup = () => {

  const context = useContext(AlertContext);

  const { setAlertMessage } = context;

  const [credentials, setCredentials] = useState({ name: "", username: "", email: "", password: "", cnfrmpassword: "" })

  const [passwordFieldState, setPasswordFieldState] = useState({
    password: false,
    cnfrmpassword: false
  });

  function togglePassword(inputId) {
    // Create a copy of the state object
    const updatedState = { ...passwordFieldState };
    // Toggle the state for the corresponding input ID
    updatedState[inputId] = !updatedState[inputId];
    // Update the state with the modified object
    setPasswordFieldState(updatedState);
  }

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.cnfrmpassword) {
      setAlertMessage("Password isnt matching", "danger");
    }
    else {
      const url = process.env.REACT_APP_SERVER_URL_FOR_SIGNUP;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: credentials.name, username: credentials.username, email: credentials.email, password: credentials.password })
      });
      const json = await response.json()
      if (json.success) {
        // Save the auth token and redirect
        localStorage.setItem('iNotebookToken', json.authToken);
        setAlertMessage("User created successfully!", "success");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
      else {
        console.error(json);
        setAlertMessage(json.error, 'danger')
      }
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div className='container my-3' style={{ maxWidth: '30rem' }}>
      <h4 className="header text-center mb-4">Create an account to use iNotebook</h4>
      <form onSubmit={handleSubmit} className='needs-validation'>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" value={credentials.name} onChange={onChange} id="name" name="name" minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <div className="input-group has-validation">
            <span className="input-group-text" id="validationTooltipUsernamePrepend">@</span>
            <input type="text" className="form-control" value={credentials.username} onChange={onChange} id="username" name="username" aria-describedby="validationTooltipUsernamePrepend" minLength={5} required />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" />
        </div>
        <label htmlFor="password" className="form-label">Create New Password</label>
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
        <label htmlFor="cnfrmpassword" className="form-label">Confirm Password</label>
        <div className="input-group mb-3">
          <input
            type={passwordFieldState.cnfrmpassword ? "text" : "password"}
            className="form-control"
            value={credentials.cnfrmpassword}
            onChange={onChange}
            id="cnfrmpassword"
            name="cnfrmpassword"
            minLength={8}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => togglePassword('cnfrmpassword')}
          >
            {passwordFieldState.cnfrmpassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
          </button>
        </div>
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default Signup
