import React from 'react'
import UserImage from '../image/user.png'

const SearchUserIndividualCard = (props) => {
    const { result } = props;
    return (
        <div className="card m-2" style={{ width: '16rem' }}>
            <img src={UserImage} className="card-img-top m-auto my-2" alt={`${result.name}`} style={{ width: '8rem', height: '8rem' }} />
            <div className="card-body">
                <h5 className="card-title">{result.name}</h5>
                <p className="card-text">This is the about section of the above user</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item"><b>Username:</b> {result.username}</li>
            </ul>
            <div className="card-body d-flex justify-content-center">
                <button type="button m-auto" className="btn btn-primary">
                    <i className="fa-solid fa-user-plus"></i> Add Friend
                </button>
            </div>
        </div>
    )
}

export default SearchUserIndividualCard
