import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from '../../context/alert/AlertContext';

const Logout = () => {
    const navigate = useNavigate();
    const context = useContext(AlertContext);
    const { setAlertMessage } = context;

    const handleLogout = () => {
        localStorage.clear();
        setAlertMessage("Logged out successfully", "success");
        navigate('/login');
    }

    return (
        <button className='btn btn-danger mx-2' onClick={handleLogout}>
            <i className="fa-solid fa-power-off"></i>
        </button>
    );
}

export default Logout;