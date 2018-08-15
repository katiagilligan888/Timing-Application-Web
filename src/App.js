import React, { Component } from 'react';
import './App.css';

//Sunrise and Sunset API lat and long required and date if date needed is not today's date

class App extends Component {
  constructor(){
    super();
    this.state = {
      latitude: null, 
      longitude: null,
    }
  }

  
  getGeoLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position =>{
        let lat = position.coords.latitude; 
        let long = position.coords.longitude;

        this.setState({
          latitude: lat, 
          longitude: long, 
        })
      }, function (error) { // error callback that produces action in the case that the location is blocked
        if (error.code == error.PERMISSION_DENIED)
            alert("This application requires the use of geolocation to work. Please enable location to proceed");
      })
    }
  }

  componentDidMount(){
    this.getGeoLocation();
  }
  
  render() {
    return (
      <div className="App">
        
      </div>
    );
  }
}

export default App;
