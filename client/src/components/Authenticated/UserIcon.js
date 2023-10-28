import React from 'react'
import { Link } from 'react-router-dom'
import '../css/UserIcon.css'

const UserIcon = () => {
    return (
        <div className="tooltip-container">
            <Link
                className="fa-solid fa-circle-user fa-2xl me-2"
                style={{ marginTop: '1.15rem' }}
                to='/user-details'
            />
            <span className="tooltip-text">User</span>
        </div>
    )
}

export default UserIcon
