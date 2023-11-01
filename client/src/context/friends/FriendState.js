import React, { useContext, useState, useEffect } from "react";
import FriendContext from "./FriendContext";
import UserContext from "../user/UserContext";

const FriendState = (props) => {
    const host = "http://localhost:5000";
    const [pendingFriends, setPendingFriends] = useState([]);
    const [friends, setFriends] = useState([]);
    const userContext = useContext(UserContext);
    let { user, fetchUserdetails } = userContext;
    const [loading, setLoading] = useState(true); // Add a loading state

    // See pending friend request
    const showPendingRequests = async () => {
        try {
            if (user && user.user && user.user._id) {
                const url = `${host}/api/friendrequests/pendingrequests/${user.user._id}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem('iNotebookToken')
                    },
                });
                const json = await response.json();
                setPendingFriends(json);
            } else {
                console.error("User data is not available or does not have _id.");
            }
        } catch (error) {
            console.error("Error while fetching pending requests:", error);
        }
    }

    // See current friends
    const currentFriends = async () => {
        try {
            if (user && user.user && user.user._id) {
                const url = `${host}/api/friendrequests/${user.user._id}/friends`
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem('iNotebookToken')
                    }
                });
                const json = await response.json();
                setFriends(json);
            } else {
                console.error("User data is not available or does not have _id.")
            }
        } catch (error) {
            console.error("Error while fetching pending requests:", error);
        }
    }

    useEffect(() => {
        fetchUserdetails()
            .then(() => {
                setLoading(false); // Set loading to false when user data is available
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
                setLoading(false); // Set loading to false on error
            });
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }    

    return (
        <FriendContext.Provider value={{ pendingFriends, showPendingRequests, friends, currentFriends }}>
            {props.children}
        </FriendContext.Provider>
    )
}

export default FriendState;
