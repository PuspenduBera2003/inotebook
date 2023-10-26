import React, { useState } from "react";
import AlertContext from "./AlertContext";

const AlertState = (props) => {
    const InitialAlert = []
    const [alert, setAlert] = useState(InitialAlert)
    const [alertType, setAlertType] = useState(null);

    const setAlertMessage = (alertMessage, alertType) => {
        setAlert(alertMessage);
        setAlertType(alertType);
        setTimeout(() => {
            setAlert(InitialAlert);
            setAlertType(null);
        }, 3000);
    }

    return (
        <AlertContext.Provider value={{ alert, alertType, setAlertMessage }}>
            {props.children}
        </AlertContext.Provider >
    )

}

export default AlertState