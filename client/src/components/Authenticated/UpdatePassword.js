import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../../context/user/UserContext';
import { useNavigate } from 'react-router-dom';
import AlertContext from '../../context/alert/AlertContext';

const UpdatePassword = () => {
    // Initialize state for each input field
    const [passwordFieldState, setPasswordFieldState] = useState({
        password: false,
        newPassword: false,
        cNewPassword: false,
    });
    const [modalClosed, setModalClosed] = useState(false);
    const Alertcontext = useContext(AlertContext);
    const { setAlertMessage } = Alertcontext;
    const [updatedPassword, setUpdatedPassword] = useState({ password: "", newPassword: "", cNewPassword: "" });
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    let { user, fetchUserdetails } = userContext;
    user = user.user;

    useEffect(() => {
        
        if (!localStorage.getItem('iNotebookToken')) {
            navigate('/login');
        }
        else {
            fetchUserdetails();
        }
    }, []);

    function togglePassword(inputId) {
        // Create a copy of the state object
        const updatedState = { ...passwordFieldState };
        // Toggle the state for the corresponding input ID
        updatedState[inputId] = !updatedState[inputId];
        // Update the state with the modified object
        setPasswordFieldState(updatedState);
    }

    const onChange = (e) => {
        setUpdatedPassword({ ...updatedPassword, [e.target.name]: e.target.value });
        if (updatedPassword.password.length > 8 && updatedPassword.newPassword.length > 8 && updatedPassword.cNewPassword.length > 8) {
            setModalClosed(true);
        } else {
            setModalClosed(false)
        }
    }

    const handleClose = () => {
        setUpdatedPassword({
            password: "",
            newPassword: "",
            cNewPassword: ""
        });
        setModalClosed(false)
    }



    const handleSubmit = async (e) => {
        // Preventing default submission of the form
        e.preventDefault();
        const username = user.username;
        const password = updatedPassword.password;
        const newPassword = updatedPassword.newPassword;
        const cNewPassword = updatedPassword.cNewPassword;
        handleClose();
        if (newPassword !== cNewPassword) {
            setAlertMessage("Confirm New Password should match with new password", "danger");
            return;
        }
        // API call
        const url = `http://localhost:5000/api/auth/updatepassword`
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('iNotebookToken')
            },
            body: JSON.stringify({ username, password, newPassword }),
        });
        const json = await response.json();
        if(!json.success) {
            setAlertMessage(json.error, "danger");
        } else {
            setAlertMessage(json.message, "success");
        }
    }


    return (
        <div>
            <button type="button" className="btn btn-primary m-auto" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Change Password
            </button>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Update Password</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose} ></button>
                        </div>
                        <form className="my-3" onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Old Password</label>
                                    <div className="input-group">
                                        <input
                                            type={passwordFieldState.password ? "text" : "password"}
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={updatedPassword.password}
                                            onChange={onChange}
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
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <div className="input-group">
                                        <input
                                            type={passwordFieldState.newPassword ? "text" : "password"}
                                            className="form-control"
                                            id="newPassword"
                                            name="newPassword"
                                            value={updatedPassword.newPassword}
                                            onChange={onChange}
                                            minLength={8}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => togglePassword('newPassword')}
                                        >
                                            {passwordFieldState.newPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cNewPassword" className="form-label">Confirm New Password</label>
                                    <div className="input-group">
                                        <input
                                            type={passwordFieldState.cNewPassword ? "text" : "password"}
                                            className="form-control"
                                            id="cNewPassword"
                                            name="cNewPassword"
                                            value={updatedPassword.cNewPassword}
                                            onChange={onChange}
                                            minLength={8}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => togglePassword('cNewPassword')}
                                        >
                                            {passwordFieldState.cNewPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss={modalClosed ? "modal" : undefined} >Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdatePassword;
