import React, { useState } from "react";
import UserContext from "./UserContext";

const UserState = (props) => {
    const InitialUser = []
    const[user, setUser] = useState(InitialUser);    
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

    return (
        <UserContext.Provider value={{ user, fetchUserdetails }}>
            {props.children}
        </UserContext.Provider >
    )

}

export default UserState