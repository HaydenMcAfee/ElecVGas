import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const StatelessComponent = (props) => {
  return (
    <select className="select-dropdown" onChange={props.getCarModels}>
      <option>Select Make</option>
      {props.carMakes.map((car, i) => {
        return <option key={i} value={`${car.value}`}>{`${car.value}`}</option>
      })}
    </select>
  )
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      year: 0,
      make: '',
      carMakes: [],
      carModels: [],
      carTrims: [],
      carInfo: []
    }
  }
  
  _getCarMakes = (event) => {
    let year = event.target.value;
    axios.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`)
    .then((res) => {
      console.log(res.data)
        let currentState = {...this.state};
        currentState.carMakes = res.data.menuItem;
        currentState.year = year;
        currentState.carModels = [];
        this.setState(currentState);
      })    
      .catch((error) => {
        console.log(error)
      })
    }

  _getCarModels = (event) => {
    let make = event.target.value;
    axios.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${this.state.year}&make=${make}`)
    .then((res) => {
      console.log(res.data)
        let currentState = {...this.state};
        if (Array.isArray(res.data.menuItem)) {
          currentState.carModels = res.data.menuItem;
          currentState.make = make;
          currentState.carTrims = [];
          this.setState(currentState);
        } else {
          currentState.carModels.push(res.data.menuItem);
          currentState.make = make;
          currentState.carTrims = [];
          this.setState(currentState);
        }
      })    
      .catch((error) => {
        console.log(error)
      })
    }  
  
    _getCarTrims = (event) => {
      let model = event.target.value;
      axios.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${this.state.year}&make=${this.state.make}&model=${model}`)
      .then((res) => {
        console.log(res.data)
          let currentState = {...this.state};
          if (Array.isArray(res.data.menuItem)) {
            currentState.carTrims = res.data.menuItem;
            this.setState(currentState);
          } else {
            currentState.carTrims.push(res.data.menuItem);
            this.setState(currentState);
          }
        })    
        .catch((error) => {
          console.log(error)
        })
      } 
      
      _getCarInfo = (event) => {
        let trim = event.target.value;
        axios.get(`https://www.fueleconomy.gov/ws/rest/vehicle/${trim}`)
        .then((res) => {
          console.log(res.data)
            let currentState = {...this.state};
            currentState.carInfo = res.data.menuItem;
            this.setState(currentState);
          })    
          .catch((error) => {
            console.log(error)
          })
        }    

  /*_getCarInfo = (event) => {
    event.preventDefault();
    let vin = event.target[0].value;
    axios.get(`https://www.fueleconomy.gov/ws/rest/vehicle/${vin}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }*/

  yearsList() {
    var array = [];

    for (let i = 1984; i<=2020; i++) {
       array.push(<option key={i} value={i}>{i}</option>)
    }

    return array;
  }

  render() {
    return (
      <div className="col">
        <h1 className="header"> 
          Fuel Type Car Comparison Tool
        </h1>
        <select className="select-dropdown" onChange={this._getCarMakes}>
            <option>Select Year</option> 
            {this.yearsList()}
        </select>
        <br />
        <StatelessComponent carMakes={this.state.carMakes} getCarModels={this._getCarModels} />
        <br />
        <select className="select-dropdown" onChange={this._getCarTrims}>
          <option>Select Model</option>
          {this.state.carModels.map((carModel, i) => {
            return <option key={i} value={`${carModel.value}`}>{`${carModel.value}`}</option>
          })}
        </select>
        <br />
        <select className="select-dropdown" onChange={this._getCarInfo}>
          <option>Select Trim</option>
          {this.state.carTrims.map((carTrim, i) => {
            return <option key={i} value={`${carTrim.value}`}>{`${carTrim.text}`}</option>
          })}
        </select>
        
      </div>
    );
  }
}

export default App;
