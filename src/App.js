import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';


class App extends React.Component{

  constructor(props){

    super(props);

    this.defaultCount = 3;
    this.maxCount = 20;
    this.minCount = 0;

    /*
    NOTE:
    Use state to store data if it is involved in rendering or data flow (i.e. if its used directly or indirectly in render method)
    Use other instance fields to store data if value is NOT involved in rendering or data flow (to prevent rendering on change of data) e.g. to store a timer ID that is not used in render method. See TimerID example in official docs to understand this valid case.
    */

    this.state = { count: this.defaultCount,
                  enableIncrement: true,
                  enableDecrement: true,
                  animationActive:false,
                  running: false
                };


  }


  incrementCount = () => {

    let newCount = this.state.count;
    newCount += 1;

    this.setState({count:newCount});

    if (newCount >= this.maxCount) {
      this.setState({enableIncrement: false});
    }
    else{
      this.setState({enableIncrement: true});
    }

    if (newCount > this.minCount) {
      this.setState({enableDecrement: true});
    }

// REMOVE FOR PROD
ReactDOM.render(<p>showing Input{newCount}</p>, document.getElementById('placeholder'));
    document.getElementById("Input"+newCount).setAttribute("type","text");





  }

  decrementCount = () => {

    let newCount = this.state.count;
    newCount -= 1;
    this.setState({count:newCount});

    if (newCount <= this.minCount) {
      this.setState({enableDecrement: false});
    }
    else{
      this.setState({enableDecrement: true});
    }

    if (newCount < this.maxCount) {
      this.setState({enableIncrement: true});
    }

    var inputID = "Input" + (newCount + 1);

    ReactDOM.render(<p>hiding {inputID}</p>, document.getElementById('placeholder'));
    document.getElementById(inputID).setAttribute("type","hidden");

  }

// generates input boxes
  generateForms = () => {
      const inputs = [];


      for (var i = 0; i < this.maxCount; i++){

        let boxID = "Input"+(i+1);

        if (i >= this.state.count ) {
          inputs.push(<input type="hidden" class="textbox" id={boxID}></input>);
        }
        else{
            inputs.push(<input type="text"class="textbox" id={boxID}></input>);
        }



      }

      return(
        <form>{inputs}</form>
      )



  }



   pickOne = () =>{



     let count = 0
     //let interval = 100 + (this.currCount * count)


     while (count < 4) {
     // animation for the boxes

     let interval = 100
     let startTime = interval * ((this.state.count * 2 * count)-(2*count))
     let currCount = this.state.count;
     //take 2 out for first and last boxes (since they are only visited once)

     setTimeout(() => {
         ReactDOM.render("currCount: " + this.state.count + ", startTime: " + startTime.toString(), document.getElementById('placeholder'));
       },
       startTime);


      for(let i = 1; i <= currCount; i++){


        // for the first box - only run it the first iteration
        // to prevent it from being ran twice


          setTimeout(() => {
              document.getElementById("Input"+i).style.backgroundColor="red"


            },
            startTime + interval*i);






// restoring the colors
          if (i > 1) {
            setTimeout(() => {
                document.getElementById("Input"+(i-1)).style.backgroundColor="inherit"
              },
              startTime + interval*i);
          }

          // coming back up (reversed order)
          setTimeout(() => {
              document.getElementById("Input"+(currCount-i+1)).style.backgroundColor="red"
            },
            startTime + (interval * (currCount + i-1)));

          // restoring the colors again
          if ((currCount - i + 2) > 0 && (currCount - i + 2) <= currCount) {
            setTimeout(() => {
                document.getElementById("Input"+(currCount-i+2)).style.backgroundColor="inherit"
              },
            startTime +  (interval * (currCount + i-1)));
            }


          }

          count += 1;




      }

    }


  render(){
    return(
      <div>
        <div id="sideButtons">
          <ul class="sideButtonsList">
            <li><button type="button" class="sideButton" onClick={this.incrementCount} disabled={!this.state.enableIncrement}>+</button></li>
            <li id="lblCount">{this.state.count}</li>
            <li><button type="button" class="sideButton" onClick={this.decrementCount} disabled={!this.state.enableDecrement}>-</button></li>
          </ul>
        </div>
        <div id="form">
          {this.generateForms()}
        </div>
        <div class="clearer"></div>

        <div id="pickButtonDiv">
          <button type="button" class="pickButton" onClick={this.pickOne}>Pick One!</button>
        </div>
    </div>
    );

  }

}


export { App};
