import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logout from './Authenticated/Logout';
import UserIcon from './Authenticated/UserIcon';
import SearchUser from './Authenticated/SearchUser';


const Navbar = () => {
    const location = useLocation();
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top shadow shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">iNotebook</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/' ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/about' ? "active" : ""}`} to="/about">About</Link>
                        </li>
                        {localStorage.getItem('iNotebookToken') &&
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/friends' ? "active" : ""}`} to="/friends">Friends</Link>
                            </li>}
                    </ul>
                    {!localStorage.getItem('iNotebookToken') ?
                        <form className="d-flex" role="search">
                            <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
                            <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
                        </form>
                        : <>
                            <SearchUser />
                            <div className="d-flex flex-wrap">
                                <UserIcon />
                                <Logout />
                            </div>
                        </>}
                </div>
            </div>
        </nav>
    )
}

export default Navbar