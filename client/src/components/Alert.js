import React from 'react'

const Alert = (props) => {
    return (
        <div className="alert alert-success" role="alert">
            A simple success alert—check it out!
            {props.message}        
        </div>
    )
}

export default Alert
