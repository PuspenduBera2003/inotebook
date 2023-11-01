import React from 'react'
import { formatDate } from '../../../utilities/DateFormater';

const CurrentFriends = (props) => {
    const {profile, request_details} = props;
    const friendSince = formatDate(request_details.date)
    return (
        <div className="card m-auto my-2" style={{ width: '25rem' }}>
            <div className="card-body">
                <h5 className="card-title">{profile.name}</h5>
                <p className="card-text">{profile.username}</p>
                <p className="card-text text-muted container" style={{ fontSize: '13px' }}>Friend Since {friendSince}</p>
            </div>
            <div className="card-footer">
                <button type="button" className="btn btn-secondary me-3" style={{ width: '8rem' }}>
                    <i className="fa-solid fa-message me-2"></i>
                    Message
                </button>
                <button type="button" className="btn btn-danger ml-3" style={{ width: '8rem' }}>
                    <i className="fa-solid fa-user-slash me-2"></i>
                    Unfriend
                </button>
            </div>
        </div>
    )
}

export default CurrentFriends
