import React from 'react'; 

const Header = (props) => {
    return (
        <div className = "header">
            <h1>Hora</h1>
            <h3>{props.time}</h3>
        </div>
    )
}

export default Header; 