import React, { useState } from "react";
import FriendContext from "./FriendContext";

const FriendState = (props) => {
    const host = "http://localhost:5000";
    const [pendingFriends, setPendingFriends] = useState([]);
    const [friends, setFriends] = useState([]);

    // Send a friend request
    const sendRequest = async (fromUserId, toUserId) => {
        const url = `${host}/api/friendrequests/send`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "auth-token": localStorage.getItem('iNotebookToken'),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fromUserId, toUserId })
        });
        const json = await response.json();
        return json;
    }

    // See pending friend request
    const showPendingRequests = async (user) => {
        try {
            if (user && user._id) {
                const url = `${host}/api/friendrequests/pendingrequests/${user._id}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem('iNotebookToken')
                    },
                });
                const json = await response.json();
                localStorage.setItem('pendingFriends',JSON.stringify(json));
                setPendingFriends(json);
            } else {
                console.error("User data is not available or does not have _id.");
            }
        } catch (error) {
            console.error("Error while fetching pending requests:", error);
        }
    }

    // See current friends
    const currentFriends = async (user) => {
        try {
            if (user && user._id) {
                const url = `${host}/api/friendrequests/${user._id}/friends`
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem('iNotebookToken')
                    }
                });
                const json = await response.json();
                localStorage.setItem('currentFriends',JSON.stringify(json));
                setFriends(json);
            } else {
                console.error("User data is not available or does not have _id.")
            }
        } catch (error) {
            console.error("Error while fetching friends:", error);
        }
    }

    // Accept friend request
    const acceptRequest = async (request_id) => {
        try {
            const url = `${host}/api/friendrequests/accept/${request_id}`
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('iNotebookToken')
                }
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Error while accepting request:", error);
        }
    }

    // Reject friend request
    const rejectRequest = async (request_id) => {
        try {
            const url = `${host}/api/friendrequests/reject/${request_id}`
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('iNotebookToken')
                }
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Error while rejecting request:", error);
        }
    }

    // Reject friend request
    const cancelRequest = async (request_id) => {
        try {
            const url = `${host}/api/friendrequests/cancel/${request_id}`
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('iNotebookToken')
                }
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Error while rejecting request:", error);
        }
    }

    // Unfriend an existing friend
    const unFriend = async (request_id) => {
        try {
            const url = `${host}/api/friendrequests/unfriend/${request_id}`
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('iNotebookToken')
                }
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Error while rejecting request:", error);
        }
    }

    // To find the request sent by the user and it has pending status
    const requestSend = async (user) => {
        try {
            if (user && user._id) {
                const url = `${host}/api/friendrequests/requestsend/${user._id}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem('iNotebookToken')
                    },
                });
                const json = await response.json();
                return json
            } else {
                console.error("User data is not available or does not have _id.");
            }
        } catch (error) {
            console.error("Error while fetching pending requests:", error);
        }
    }


    return (
        <FriendContext.Provider value={{ sendRequest, pendingFriends, showPendingRequests, friends, currentFriends, acceptRequest, rejectRequest, unFriend, requestSend, cancelRequest }}>
            {props.children}
        </FriendContext.Provider>
    )
}

export default FriendState;
