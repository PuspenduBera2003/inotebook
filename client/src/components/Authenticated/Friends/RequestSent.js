import React, { useContext } from 'react'
import { formatDate } from '../../../utilities/DateFormater';
import friendContext from '../../../context/friends/FriendContext';
import AlertContext from '../../../context/alert/AlertContext';

const RequestSent = (props) => {
    const { profile, request_details } = props;

    const context = useContext(friendContext);
    const { cancelRequest } = context;

    const alertContext = useContext(AlertContext);
    const { setAlertMessage } = alertContext;

    const request_send_at = formatDate(request_details.date);

    const doCancelRequest = async () => {
        const response_from_server = await cancelRequest(request_details._id);
        if(response_from_server.success) {
            setAlertMessage(response_from_server.message, "success");
        } else {
            setAlertMessage(response_from_server.message, "danger");
        }
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    return (
        <div className="card m-auto my-2" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{profile.name}</h5>
                <p className="card-text">{profile.username}</p>
                <p className="card-text text-muted" style={{ fontSize: '13px' }}>{request_send_at}</p>
            </div>
            <div className="card-footer">
                <button type="button m-auto" className="btn btn-danger" onClick={doCancelRequest}>
                    <i className="fa-solid fa-user-xmark"></i> Cancel Request
                </button>
            </div>
        </div>
    )
}

export default RequestSent
