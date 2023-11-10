import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/user/UserContext';
import SearchUserIndividualCard from './SearchUserIndividualCard';

const SearchUserResult = () => {
    const navigate = useNavigate();
    let storedData;
    const userContext = useContext(UserContext);
    let { user } = userContext;
    const currentUser = user.user;
    if (localStorage.getItem('searchResult')) {
        storedData = JSON.parse(localStorage.getItem('searchResult'));
    }

    useEffect(() => {
        if (localStorage.getItem('iNotebookToken') === null) {
            navigate('/login')
        }
        if (localStorage.getItem('searchResult') === null) {
            navigate('/')
        }
    }, [navigate]);
    return (
        <div className='container my-2'>
            <div className="container d-flex flex-wrap justify-content-center my-4 rounded-2" style={{ background: '#b7b7b7' }}>
                {storedData && storedData.success && storedData.matchedUser.map((user) => (
                    <div key={user._id}>
                        <SearchUserIndividualCard result={user} user={currentUser} />
                    </div>
                ))
                }
            </div>
            {storedData.success === false && <div className='border border-danger border-2 my-3 p-2 bg-danger-subtle rounded-2'>
                <div className='text-center text-danger' style={{ width: '85vw' }}>
                <i className="fa-solid fa-xmark me-2" style={{cursor:'auto'}}></i>
                    <h5 className='d-inline'>No such user found that matches your query</h5>
                </div>
            </div>}
        </div>
    )
}

export default SearchUserResult
