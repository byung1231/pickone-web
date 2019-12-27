import React from 'react';
import logo from './logo.svg';
import './App.css';

/*
function App() {
  return (
    <div id="title">
      PickOne-Web
    </div>
  );
}*/

class Count extends React.Component{

  constructor(){
    super();
    this.state = { count: 3,
                  enableIncrement: true,
                  enableDecrement: true
                };

    this.maxCount = 20;
    this.minCount = 0;
  }

  increment = () => {

    let currCount = this.state.count;
    currCount += 1;
    this.setState({count:currCount});

    if (currCount >= this.maxCount) {
      this.setState({enableIncrement: false});
    }
    else{
      this.setState({enableIncrement: true});
    }

    if (currCount > this.minCount) {
      this.setState({enableDecrement: true});
    }


  }

  decrement = () => {

    let currCount = this.state.count;
    currCount -= 1;
    this.setState({count:currCount});

    if (currCount <= this.minCount) {
      this.setState({enableDecrement: false});
    }
    else{
      this.setState({enableDecrement: true});
    }

    if (currCount < this.maxCount) {
      this.setState({enableIncrement: true});
    }
  }

  render(){
    return(
      <div>
      <ul class="sideButtonsList">
          <li><button type="button" class="sideButton" onClick={this.increment} disabled={!this.state.enableIncrement}>+</button></li>
          <li id="lblCount">{this.state.count}</li>
          <li><button type="button" class="sideButton" onClick={this.decrement} disabled={!this.state.enableDecrement}>-</button></li>
        </ul>

        <div class="clearer"></div>
      </div>
    )


  }

}
/*
function increment(){

  return(
    var count = document.getElementById('lblCount').innerHTML;

    document.getElementById('lblCount').innerHTML = count + 1;

  );

}*/



const Form = () => (

    <form>
      <input type="text" class="textbox"></input><br/>
      <input type="text" class="textbox"></input>
      <input type="text" class="textbox"></input>

    </form>

);


const PickButton = () => (

  <button type="button" class="pickButton">Pick One!</button>


);


export { Count, Form, PickButton};
