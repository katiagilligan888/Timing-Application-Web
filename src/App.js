import React, { Component } from 'react';
import './App.css';
import axios from 'axios'; 
import moment from 'moment'; 
import LocationBlocked from './Components/LocationBlocked'; 
import Header from './Components/Header'; 
import Sunrise from './sunrise.svg'; 



class App extends Component {
  constructor(){
    super();
    this.state = {
      locationBlocked: false,
      latitude: null, 
      longitude: null,
      sunriseTodayAPI: null,
      dateToday: null, 
      UTCformat: null,
      localSunriseTime: null, 
      displayTime: null, 
      weekday: null,
      daysOfWeek : [
          {day: 'Sunday', horas : ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury"]},
          {day: 'Monday', horas : ["Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter"]},
          {day: 'Tuesday', horas: ["Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun", "Venus"]},
          {day: 'Wednesday', horas : ["Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus","Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus","Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus","Mercury", "Moon", "Saturn"]},
          {day: 'Thursday', horas: ["Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun"]},
          {day: 'Friday', horas: ["Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun","Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun","Venus", "Mercury", "Moon", "Saturn","Jupiter", "Mars", "Sun","Venus", "Mercury", "Moon"]},
          {day: 'Saturday', horas: ["Saturn","Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon","Saturn","Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon","Saturn","Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon","Saturn", "Jupiter", "Mars"]}
      ], 
      todaysHoras: null,
    }
  }

  displayTime() {
    let time = new Date()
    const options = {hour12: true, hour: 'numeric', minute: 'numeric', weekday: 'long', month: 'long', day: 'numeric'}
    let newTime = time.toLocaleString('en-US', options); 
    this.setState({displayTime: newTime})
    setInterval(() => {
      time = new Date(); 
      newTime = time.toLocaleString('en-US', options); 
      this.setState({displayTime: newTime})
    }, 15000)
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
      }, (error)  => { // error callback that produces action in the case that the location is blocked
        if (error.code === error.PERMISSION_DENIED)
          {this.setState({locationBlocked: true})}
      })
    }
  }

  // takes in the API call sunrise time as time parameter to transform time to UTC format so it can then be transferred to local.
  toUTCFormat(time){
    const timeArr = time.split(' ')
    let month = this.state.dateToday.getMonth() + 1;
    let day = this.state.dateToday.getDate();
    let year = this.state.dateToday.getFullYear();

    if(month.length < 2){
        month = '0' + month.toString();
    }

    if(day.length < 2){
        day = '0' + day.toString();
    }

    let yearlyDateFormat = [year, month, day].join('-');
    const daysArr = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let weekday = daysArr[moment(yearlyDateFormat).day()]; 
     time = yearlyDateFormat + " " +  timeArr[0]
     

     this.setState({
       UTCformat: time,
       weekday: weekday
     })
  }

  //from UTCtime to localTime
  toLocalTime(){
    const local = moment.utc(this.state.UTCformat).local().format('hh:mm a')
     this.setState({
       localSunriseTime: local
     })
  }

  componentDidMount(){
    this.setState({dateToday: new Date()})
    this.getGeoLocation();
    this.displayTime(); 
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
    
    //get the correct array and date to render
    let horas; 
    let firstHora; 
    let horasArr; 
    let divStyle; 
    
    for(let x = 0; x < this.state.daysOfWeek.length; x++){
      if(this.state.weekday === this.state.daysOfWeek[x].day){
        horas = this.state.daysOfWeek[x].horas
        let horaTime; 
        for(let y = 0; y < horas.length; y ++){
          
        }
      
        horasArr = horas.map((hora, index) => {
          let horaTime = moment(this.state.localSunriseTime, 'HH.mm').add(index,'hours').format('hh:mm a'); 
          let horaTimePlusOne = moment(horaTime, "HH.mm").add(1,'hours').format('hh:mm a')
          
          if(hora === 'Saturn' || hora === 'Mars'){
            divStyle = {
              backgroundColor: "rgba(255,0,0,0.7)"
            }
          }else if(hora === 'Venus' || hora === 'Jupiter' || hora === 'Moon'){
            divStyle = {
              backgroundColor: "rgba(34,139,34, 0.7)"
            }
          }else if(hora === 'Mercury' || hora === 'Sun'){
            divStyle = {
              backgroundColor: "rgba(255,255,	0, 0.7)"
            }
          }
         
          return (
            <div key = {index} style = {divStyle} className = 'hora'><p className = "hour-name">Hour of: {hora} </p><p className ="time"> {horaTime} - {horaTimePlusOne}</p> </div>
          )
        });
        firstHora = horas[0]; 
      }
  }
    return (
      <div className="App">
        {this.state.locationBlocked ? <LocationBlocked /> : null}
        <Header sunrise = {this.state.localSunriseTime} day = {firstHora} time = {this.state.displayTime}/>
        {horasArr}
      </div>
    );
  }
}

export default App;
