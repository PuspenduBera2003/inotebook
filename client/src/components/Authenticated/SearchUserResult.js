import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SearchUserIndividualCard from './SearchUserIndividualCard';

const SearchUserResult = () => {
    const navigate = useNavigate();
    let storedData;
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
    }, [localStorage.getItem('searchResult')]);
    return (
        <div className='container my-2'>
            {storedData && <h3 className='text-center my-2'>Matched Users</h3>}
            <div className="container d-flex flex-wrap">
                {storedData && storedData.success ? storedData.matchedUser.map((user) => (
                    <SearchUserIndividualCard result={user} key={user._id} />
                ))
                    :
                    <div className='border border-2 my-3 p-2'>
                        <div className='text-center text-danger' style={{ width: '85vw' }}>No such user found that matches your query</div>
                    </div>
                }
            </div>
        </div>
    )
}

export default SearchUserResult
