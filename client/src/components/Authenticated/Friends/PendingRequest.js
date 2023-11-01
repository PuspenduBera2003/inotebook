import React from 'react'
import { formatDate } from '../../../utilities/DateFormater';

const PendingRequest = (props) => {
    const { profile, request_details } = props;
    const formattedDate = formatDate(request_details.date)
    return (
        <div className="card m-auto my-2" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{profile.name}</h5>
                <p className="card-text">{profile.username}</p>
                <p className="card-text text-muted" style={{fontSize:'13px'}}>{formattedDate}</p>
            </div>
            <div className="card-footer">
                <button type="button" className="btn btn-primary me-3" style={{ width: '6rem' }}>Confirm</button>
                <button type="button" className="btn btn-primary ml-3" style={{ width: '6rem' }}>Reject</button>
            </div>
        </div>
    )
}

export default PendingRequest
