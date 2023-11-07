import React, { useContext } from 'react'
import { formatDate } from '../../../utilities/DateFormater';
import friendContext from '../../../context/friends/FriendContext';
import AlertContext from '../../../context/alert/AlertContext';

const PendingRequest = (props) => {
    const context = useContext(AlertContext);
    const { setAlertMessage } = context;

    const FriendContext = useContext(friendContext);
    const { acceptRequest, rejectRequest } = FriendContext;

    const { profile, request_details } = props;
    const formattedDate = formatDate(request_details.date)

    const confirmRequest = async () => {
        const response = await acceptRequest(request_details._id);
        if(response.success === true) {
            setAlertMessage(`${profile.name} and you are friends now`, "success");
            setTimeout(() => {    
                window.location.reload();
            }, 3000);
        } else {
            setAlertMessage("Error while confirming request", "danger");
            setTimeout(() => {    
                window.location.reload();
            }, 3000);
        }
    }

    const declineRequest = async () => {
        const response = await rejectRequest(request_details._id);
        if(response.success === true) {
            setAlertMessage(`Friend request of ${profile.name} is rejected`, "success");
            setTimeout(() => {    
                window.location.reload();
            }, 3000);
        } else {
            setAlertMessage("Error while rejecting", "danger");
            setTimeout(() => {    
                window.location.reload();
            }, 3000);
        }
    }

    return (
        <div className="card m-auto my-2" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{profile.name}</h5>
                <p className="card-text">{profile.username}</p>
                <p className="card-text text-muted" style={{ fontSize: '13px' }}>{formattedDate}</p>
            </div>
            <div className="card-footer">
                <button type="button" className="btn btn-primary me-3" style={{ width: '6rem' }} onClick={confirmRequest}>Confirm</button>
                <button type="button" className="btn btn-primary ml-3" style={{ width: '6rem' }} onClick={declineRequest}>Reject</button>
            </div>
        </div>
    )
}

export default PendingRequest
