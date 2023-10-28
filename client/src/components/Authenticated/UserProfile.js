import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertContext from '../../context/alert/AlertContext'
import UserContext from '../../context/user/UserContext';
import { formatDate } from '../../utilities/DateFormater'

const UserProfile = () => {
    const navigate = useNavigate();
    const context = useContext(AlertContext);
    const { setAlertMessage } = context;
    const userContext = useContext(UserContext);
    let { user } = userContext;
    user = user.user;
    let userCreatedAt;
    if(user) {
        userCreatedAt = formatDate(user.date); 
    }
    useEffect(() => {
        if (!localStorage.getItem('iNotebookToken')) {
            setAlertMessage("You are not authenticated", "danger");
            navigate('/login');
        }
    }, []);
    return (
        <div className="card w-50 m-auto mt-4">
            <div className="card-body">
                <h5 className="card-title text-center">iNotebook User Details</h5>
                <p className="card-text text-center">Thanks for being a valuable iNotebook user</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item text-center"><h6 className='header d-inline'>Name :</h6> {user && user.name}</li>
                <li className="list-group-item text-center"><h6 className='header d-inline'>Username :</h6> {user && user.username}</li>
                <li className="list-group-item text-center"><h6 className='header d-inline'>Email Id :</h6> {user && user.email}</li>
                <li className="list-group-item text-center"><h6 className='header d-inline'>User created at :</h6> {user && userCreatedAt}</li>
            </ul>
        </div>
    )
}

export default UserProfile
