import React, { useState } from 'react';

const UpdatePassword = () => {
    // Initialize state for each input field
    const [passwordFieldState, setPasswordFieldState] = useState({
        password: false,
        newPassword: false,
        cNewPassword: false,
    });

    function togglePassword(inputId) {
        // Create a copy of the state object
        const updatedState = { ...passwordFieldState };
        // Toggle the state for the corresponding input ID
        updatedState[inputId] = !updatedState[inputId];
        // Update the state with the modified object
        setPasswordFieldState(updatedState);
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
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Old Password</label>
                                    <div className="input-group">
                                        <input
                                            type={passwordFieldState.password ? "text" : "password"}
                                            className="form-control"
                                            id="password"
                                            name="password"
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
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdatePassword;
