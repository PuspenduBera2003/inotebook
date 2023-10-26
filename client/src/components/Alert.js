import React, { useContext } from 'react'
import AlertContext from '../context/alert/AlertContext'

const Alert = () => {
    const context = useContext(AlertContext);

    const { alert, alertType } = context;    

    return (
        <div className="w-100 position-fixed d-flex justify-content-center" style={{zIndex:'1'}} id='alert'>
            <div className={`alert alert-${alertType} text-center my-1 w-50`} role="alert">
                {alert}
            </div>
        </div>
    )
}

export default Alert
