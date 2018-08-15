import React, { Component } from 'react';
import './App.css';
import axios from 'axios'; 
import moment from 'moment'; 
import LocationBlocked from './Components/LocationBlocked'; 

//Sunrise and Sunset API lat and long required and date if date needed is not today's date

class App extends Component {
  constructor(){
    super();
    this.state = {
      locationBlocked: false,
      latitude: null, 
      longitude: null,
      sunriseTodayAPI: null,
      date: null, 
      UTCformat :null,
      localSunriseTime: null, 
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
          date: new Date(),
        })
      }, (error)  => { // error callback that produces action in the case that the location is blocked
        if (error.code === error.PERMISSION_DENIED)
          {this.setState({locationBlocked: true})}
      })
    }
  }

  // takes in the API call sunrise time as time parameter to transform time to UTC format so it can then be transferred to local.
  toUTCFormat(time){
    const timeArr = time.split(' ')
    let month = this.state.date.getMonth() + 1;
    let day = this.state.date.getDate();
    let year = this.state.date.getFullYear();

    if(month.length < 2){
        month = '0' + month.toString();
    }

    if(day.length < 2){
        day = '0' + day.toString();
    }

    const yearlyDateFormat = [year, month, day].join('-');
     time = yearlyDateFormat + " " +  timeArr[0]

     this.setState({
       UTCformat: time,
     })
  }

  //from UTCtime to localTime
  toLocalTime(){
    const local = moment.utc(this.state.UTCformat).local().format('hh:mm:ss a')
     this.setState({
       localSunriseTime: local
     })
  }

  componentDidMount(){
    this.getGeoLocation();
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.latitude !== this.state.latitude || prevState.longitude !== this.state.longitude){
      axios.get(`https://api.sunrise-sunset.org/json?lat=${this.state.latitude}&lng=${this.state.longitude}`).then(response => {
      this.setState({
          sunriseTodayAPI: response.data.results.sunrise
        })
      })
    }
    if(prevState.sunriseTodayAPI !== this.state.sunriseTodayAPI) {
      // const local = moment.utc(this.state.sunriseTodayUTC).local().format('hh:mm:ss a')
      // console.log(local); 
      this.toUTCFormat(this.state.sunriseTodayAPI)
    }
    if(prevState.UTCformat !== this.state.UTCformat){
      this.toLocalTime()
    }
  }
  
  render() {
    return (
      <div className="App">
        {this.state.locationBlocked ? <LocationBlocked /> : null}
      </div>
    );
  }
}

export default App;
