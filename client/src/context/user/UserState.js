import React, { useState } from "react";
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

    return (
        <UserContext.Provider value={{ user, fetchUserdetails, searchUser }}>
            {props.children}
        </UserContext.Provider >
    )

}

export default UserState