import React, { useContext, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom'
import AlertContext from '../../context/alert/AlertContext'
import UserContext from '../../context/user/UserContext';
import { formatDate } from '../../utilities/DateFormater'
import UpdatePassword from './UpdatePassword'

const UserProfile = () => {
    const navigate = useNavigate();
    const context = useContext(AlertContext);
    const { setAlertMessage } = context;
    const userContext = useContext(UserContext);
    let { user, fetchUserdetails } = userContext;
    user = user.user;
    let userCreatedAt;
    if (user) {
        userCreatedAt = formatDate(user.date);
    }
    useEffect(() => {
        if (!localStorage.getItem('iNotebookToken')) {
            setAlertMessage("You are not authenticated", "danger");
            navigate('/login');
        }
        else {
            fetchUserdetails();
        }
    }, []);
    return (
        <>
            <div className="card w-50 m-auto mt-4">
                <div className="card-body">
                    <h5 className="card-title text-center">iNotebook User Details</h5>
                    <p className="card-text text-center">Thanks for being a valuable iNotebook user</p>
                </div>
                {!user ? <div className='m-auto w-75'>
                    <Skeleton count={4} height={'1.5rem'} style={{ maxWidth: '30rem' }} className='d-flex align-self-center' />
                </div>
                    : <ul className="list-group list-group-flush">
                        <li className="list-group-item text-center"><h6 className='header d-inline'>Name :</h6> {user && user.name}</li>
                        <li className="list-group-item text-center"><h6 className='header d-inline'>Username :</h6> {user && user.username}</li>
                        <li className="list-group-item text-center"><h6 className='header d-inline'>Email Id :</h6> {user && user.email}</li>
                        <li className="list-group-item text-center"><h6 className='header d-inline'>User created at :</h6> {user && userCreatedAt}</li>
                    </ul>}
            </div>
            {user && <div className='d-flex justify-content-center my-3'><UpdatePassword /></div>}
        </>
    )
}

export default UserProfile
