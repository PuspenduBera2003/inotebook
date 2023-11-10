import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
    const InitialUser = []
    const [user, setUser] = useState(InitialUser);
    const fetchUserdetails = async () => {
        const url = "http://localhost:5000/api/auth/getuser"
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "auth-token": localStorage.getItem('iNotebookToken')
            },
        });
        const User = await response.json()
        setUser(User);
    }

    const searchUser = async (name) => {
        const url = "http://localhost:5000/api/user/search"
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "auth-token": localStorage.getItem('iNotebookToken'),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name })
        });
        const matchedUser = await response.json();
        localStorage.setItem("searchResult", JSON.stringify(matchedUser));
        return matchedUser
    }

    const [loading, setLoading] = useState(true); // Add a loading state
    useEffect(() => {
        if (localStorage.getItem('iNotebookToken') === null) {
            setLoading(false);
        }
        else {
            fetchUserdetails()
                .then(() => {
                    setLoading(false); // Set loading to false when user data is available
                })
                .catch((error) => {
                    console.error("Error fetching user details:", error);
                    setLoading(false); // Set loading to false on error
                });
        }
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
        <UserContext.Provider value={{ user, fetchUserdetails, searchUser }}>
            {props.children}
        </UserContext.Provider >
    )

}

export default UserState