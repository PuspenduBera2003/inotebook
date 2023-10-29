import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../css/UserIcon.css'

const UserIcon = () => {
    const location = useLocation();
    return (
        <div className="tooltip-container">
            {location.pathname !== '/user-details'?<Link
                className="fa-solid fa-circle-user fa-2xl me-2"
                style={{ marginTop: '1.15rem' }}
                to='/user-details'
            />:<i className="fa-solid fa-circle-user fa-2xl me-2" style={{ marginTop: '1.15rem' }}></i>}
            <span className="tooltip-text">User</span>
        </div>
    )
}

export default UserIcon
