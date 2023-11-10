import React, { useContext, useEffect, useState } from 'react';
import UserImage from '../image/user.png';
import friendContext from '../../context/friends/FriendContext';
import AlertContext from '../../context/alert/AlertContext';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const SearchUserIndividualCard = (props) => {
    const { result, user } = props;
    const context = useContext(friendContext);
    const { sendRequest, requestSend, currentFriends, unFriend, cancelRequest, showPendingRequests, acceptRequest, rejectRequest } = context;
    const alert = useContext(AlertContext);
    const { setAlertMessage } = alert;

    const navigate = useNavigate();

    const [RequestSend, setRequestSend] = useState(false);
    const [currentFriend, setCurrentFriend] = useState(false);
    const [pendingRequest, setPendingRequest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let friends_now;
                const res = await requestSend(user);
                await currentFriends(user);
                await showPendingRequests(user);
                const arr = res.pendingRequests;
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index].to;
                    if (element === result._id) {
                        setRequestSend(true);
                        localStorage.setItem(`request_details[${result.username}]`, JSON.stringify(arr[index]));
                        break;
                    }
                }
                if (localStorage.getItem('currentFriends')) {
                    friends_now = JSON.parse(localStorage.getItem('currentFriends'));
                    if (friends_now && friends_now.success) {
                        const array = friends_now.request
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            if (element.to === result._id || element.from === result._id) {
                                setCurrentFriend(true);
                                localStorage.setItem(`request_details[${result.username}]`, JSON.stringify(array[index]));
                                break;
                            }
                        }
                    }
                }
                if (localStorage.getItem('pendingFriends')) {
                    let pendingRequests = JSON.parse(localStorage.getItem('pendingFriends'))
                    if (pendingRequests && pendingRequests.pendingRequests) {
                        let array = pendingRequests.pendingRequests
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            if (element.from === result._id) {
                                localStorage.setItem(`pendingRequest[${element.from}]`, JSON.stringify(element));
                                setPendingRequest(true);
                            }
                        }
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addFriend = async () => {
        const response = await sendRequest(user._id, result._id);
        if (response.success) {
            setAlertMessage(`Friend request sent to ${result.name}`, "success");
        } else {
            setAlertMessage(response.message, "danger");
        }
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    const doUnfriend = async () => {
        const request_details_json = JSON.parse(localStorage.getItem(`request_details[${result.username}]`));
        const response_from_server = await unFriend(request_details_json._id);
        if (response_from_server.success) {
            setAlertMessage(`${result.name} is successfully unfriend`, "success");
        } else {
            setAlertMessage(response_from_server.message, "danger")
        }
        localStorage.removeItem(`request_details[${result.username}]`);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    const doCancelRequest = async () => {
        const request_details_json = JSON.parse(localStorage.getItem(`request_details[${result.username}]`));
        const response_from_server = await cancelRequest(request_details_json._id);
        if (response_from_server.success) {
            setAlertMessage(response_from_server.message, "success");
        } else {
            setAlertMessage(response_from_server.message, "danger")
        }
        localStorage.removeItem(`request_details[${result.username}]`);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    const viewProfile = () => {
        navigate('/user-details');
    }

    const confirmRequest = async () => {
        const pendingRequestDetails = JSON.parse(localStorage.getItem(`pendingRequest[${result._id}]`));
        const response = await acceptRequest(pendingRequestDetails._id);
        if (response.success === true) {
            localStorage.removeItem(`pendingRequest[${result._id}]`)
            setAlertMessage(`${result.name} and you are friends now`, "success");
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
        const pendingRequestDetails = JSON.parse(localStorage.getItem(`pendingRequest[${result._id}]`));
        const response = await rejectRequest(pendingRequestDetails._id);
        if (response.success === true) {
            localStorage.removeItem(`pendingRequest[${result._id}]`)
            setAlertMessage(`Friend request of ${result.name} is rejected`, "success");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            setAlertMessage(`Error while rejecting request of ${result.name}`, "danger");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }

    
    return (
        <div className="card m-4" style={{ width: '18rem' }}>
            {currentFriend && (result._id !== user._id) && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                Friend
                <span className="visually-hidden">frined</span>
            </span>}
            {result._id === user._id && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ backgroundColor: '#7e00ff' }}>
                My Profile
                <span className="visually-hidden">my profile</span>
            </span>}
            {loading ?
                <Skeleton animation="wave" variant="circular" width={130} height={130} style={{ margin: 'auto', marginTop: '8px' }} />
                :
                <img src={UserImage} className="card-img-top m-auto my-2" alt={`${result.name}`} style={{ width: '8rem', height: '8rem' }} />}
            <div className="card-body">
                {loading ?
                    <Skeleton variant="text" sx={{ fontSize: '2rem', width: '80%', margin: 'auto' }} />
                    :
                    <h5 className="card-title text-center">{result.name}</h5>}
                {loading ?
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    :
                    <p className="card-text" style={{ textAlign: 'justify' }}>This is the about section of the above user</p>}
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item text-center">
                    {loading ?
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%', margin: 'auto' }} />
                        :
                        <div>
                            <b>Username:</b> {result.username}
                        </div>}
                </li>
            </ul>
            <div className="card-body d-flex justify-content-center">
                {loading ?
                <Skeleton variant="text" sx={{ fontSize: '2rem', width: '80%', margin: 'auto' }} />
                :
                <div>
                    {(result._id === user._id) ? <button className='btn btn-dark text-light' onClick={viewProfile}>
                        View Your Profile
                    </button> :
                        currentFriend ?
                            <>
                                <button type="button" className="btn btn-secondary me-3" style={{}}>
                                    <i className="fa-solid fa-message me-2"></i>
                                    Message
                                </button>
                                <button className='btn btn-danger' onClick={doUnfriend}>
                                    <i className="fa-solid fa-user-slash me-2"></i>Unfriend
                                </button>
                            </>
                            : pendingRequest ?
                                <div>
                                    <button type="button" className="btn btn-success me-3" style={{ width: '6rem' }} onClick={confirmRequest} >Confirm</button>
                                    <button type="button" className="btn btn-danger ml-3" style={{ width: '6rem' }} onClick={declineRequest} >Reject</button>
                                </div>
                                :
                                RequestSend ? (
                                    <button type="button m-auto" className="btn btn-danger" onClick={doCancelRequest}>
                                        <i className="fa-solid fa-user-xmark"></i> Cancel Request
                                    </button>
                                ) : (
                                    <button type="button m-auto" className="btn btn-primary" onClick={addFriend}>
                                        <i className="fa-solid fa-user-plus"></i> Add Friend
                                    </button>
                                )}
                </div>}
            </div>
        </div>
    );
};

export default SearchUserIndividualCard;
