import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from '../../context/alert/AlertContext';

const Logout = () => {
    const navigate = useNavigate();
    const context = useContext(AlertContext);
    const { setAlertMessage } = context;

    const handleLogout = () => {
        localStorage.removeItem('iNotebookToken');
        setAlertMessage("Logged out successfully", "success");
        navigate('/login');
    }

    return (
        <button className='btn btn-primary mx-2' onClick={handleLogout}>Logout</button>
    );
}

export default Logout;