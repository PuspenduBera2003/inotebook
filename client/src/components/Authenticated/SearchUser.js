import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/user/UserContext';
import { useNavigate } from 'react-router-dom';

const SearchUser = () => {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    let { searchUser } = userContext;
    const [userSearch, setUserSearch] = useState({ name: "" });
    const [matchedUserResponse, setMatchedUserResponse] = useState(null);

    const onChange = (e) => {
        setUserSearch({ ...userSearch, [e.target.name]: e.target.value });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const response = await searchUser(userSearch.name);
        setMatchedUserResponse(response);
    }

    useEffect(() => {
        if(matchedUserResponse){
            navigate(`/user?query=${encodeURIComponent(userSearch.name)}`);
        }
    }, [matchedUserResponse]);

    return (
        <div>
            <form className="d-flex me-3" role="search" onSubmit={onSubmit}>
                <input className="form-control me-2" type="search" placeholder="Search User" aria-label="Search" name='name' id='name' onChange={onChange} />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
        </div>
    )
}

export default SearchUser;
