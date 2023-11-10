import React, { useContext, useEffect } from 'react'
import friendContext from '../../../context/friends/FriendContext'
import PendingRequest from './PendingRequest';
import CurrentFriends from './CurrentFriends';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../context/user/UserContext';

const Friends = () => {
    const pendingRequests = useContext(friendContext);
    const { pendingFriends, showPendingRequests, friends, currentFriends } = pendingRequests;
    const userContext = useContext(UserContext);
    let { user } = userContext;
    user = user.user;
    const navigate = useNavigate();
    useEffect(() => {
        showPendingRequests(user);
        currentFriends(user);
        let token = localStorage.getItem('iNotebookToken');
        if (!token) {
            navigate('/login');
        }
    }, []);

    return (
        <div className="container text-center my-3">
            <div className="row">
                <div className="col">
                    <div className="container m-auto bg-primary-subtle rounded-2 border border-primary my-3 p-1" style={{ width: '19rem' }}>
                        <h4 className='text-center text-muted'>Pending Friend Requests</h4>
                    </div>
                    {pendingFriends.length !== 0 ? (
                        pendingFriends.pendingRequests.length === 0 ? (
                            <div className='p-2 rounded-3'>
                                <h6>No New Friend Request</h6>
                            </div> 
                        ) : (
                            <div className='container d-flex flex-wrap rounded-2' style={{backgroundColor:'#d3d3d3'}}>
                                {pendingFriends.pendingRequestsProfile.map((profile, index) => (
                                    <PendingRequest
                                        profile={profile}
                                        request_details={pendingFriends.pendingRequests[index]}
                                        key={profile._id}
                                    />
                                ))}
                            </div>
                        )
                    ) : null}
                </div>
                <div className="col">
                    <div className="container m-auto bg-success-subtle rounded-2 border border-success my-3 p-1" style={{ width: '12rem' }}>
                        <h4 className='text-center text-muted'>Your Friends</h4>
                    </div>
                    {friends.length !== 0 ? (
                        friends.friends.length === 0 ? (
                            <div className='p-2 rounded-3'>
                                <h6>You don't have any friends. To expand your network kindly add friend</h6>
                            </div> 
                        ) : (
                            <div className='container d-flex flex-wrap rounded-2' style={{backgroundColor:'#d3d3d3'}}>
                                {friends.friends.map((profile, index) => (
                                    <CurrentFriends
                                        profile={profile}
                                        request_details={friends.request[index]}
                                        key={profile._id}
                                    />
                                ))}
                            </div>
                        )
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Friends
