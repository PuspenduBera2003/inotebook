import React, { useContext } from 'react'
import { formatDate } from '../../../utilities/DateFormater';
import AlertContext from '../../../context/alert/AlertContext';
import friendContext from '../../../context/friends/FriendContext';
import UserContext from '../../../context/user/UserContext';

const CurrentFriends = (props) => {
    const context = useContext(AlertContext);
    const { setAlertMessage } = context;

    const FriendContext = useContext(friendContext);
    const { unFriend } = FriendContext;

    const userContext = useContext(UserContext);
    let { user } = userContext;


    const { profile, request_details } = props;

    function findCommonElements(arr1, arr2) {
        const commonElements = arr1.filter(element => arr2.includes(element));
        return commonElements;
    }

    const commonFriends = findCommonElements(user.user.friends, profile.friends);

    const friendSince = formatDate(request_details.date)

    const doUnfriend = async () => {
        const response = await unFriend(request_details._id);
        if (response.success === true) {
            setAlertMessage(`${profile.name} unfriended successfully`, "success");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            setAlertMessage(`Error while unfriending ${profile.name}`, "danger")
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }
    return (
        <div className="card m-auto my-2" style={{ width: '25rem' }}>
            <div className="card-header">
                <h5 className="card-title">{profile.name}</h5>
            </div>
            <div className="card-body">
                <p className="card-text"><b>Username: </b> {profile.username}</p>
                <div className="mb-2 bg-light py-2 m-auto rounded-2 border border-dark-subtle">
                    <h6 className='mb-1 pb-2 border-bottom border-dark-subtle' >Mutual Friends</h6>
                    <div className='d-flex flex-wrap justify-content-center'>
                        {commonFriends.length !== 0 ?commonFriends.map((friend, index) => (
                            <span key={index} className='mx-3'>{friend}</span>
                        )):<div>No Mutual Friends</div>}
                    </div>
                </div>
                <p className="card-text text-muted container" style={{ fontSize: '13px' }}>Y<span className="text-lowercase">ou are friend since {friendSince}</span></p>
            </div>
            <div className="card-footer">
                <button type="button" className="btn btn-secondary me-3" style={{ width: '8rem' }}>
                    <i className="fa-solid fa-message me-2"></i>
                    Message
                </button>
                <button type="button" className="btn btn-danger ml-3" style={{ width: '8rem' }} onClick={doUnfriend}>
                    <i className="fa-solid fa-user-slash me-2"></i>
                    Unfriend
                </button>
            </div>
        </div>
    )
}

export default CurrentFriends
