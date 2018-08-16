import React from 'react'; 
import Sunrise from '../sunrise.svg'; 

const Header = (props) => {
    return (
        <div className = "header">
            <img src = {Sunrise} width = "100px" height = "100px"/>
            <h1>Hora</h1>
            <h3>{props.time}</h3>
            <h3>Sunrise Today: {props.sunrise}</h3>
            <h3>Day of {props.day} </h3>
        </div>
    )
}

export default Header; 