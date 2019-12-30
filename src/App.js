import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';


class App extends React.Component{

  constructor(){

    super();

    this.defaultCount = 3;
    this.maxCount = 20;
    this.minCount = 0;
    this.currCount = this.defaultCount;


    this.state = { count: this.defaultCount,
                  enableIncrement: true,
                  enableDecrement: true,
                  animationActive:false
                };

      this.myRef = React.createRef();

  }

  componentDidMount(){



  }

  incrementCount = () => {

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


ReactDOM.render(<p>showing Input{currCount}</p>, document.getElementById('placeholder'));
    document.getElementById("Input"+currCount).setAttribute("type","text");





  }

  decrementCount = () => {

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

    var inputID = "Input" + (currCount + 1);

    ReactDOM.render(<p>hiding {inputID}</p>, document.getElementById('placeholder'));
    document.getElementById(inputID).setAttribute("type","hidden");

  }

// generates input boxes
  generateForms = () => {
      const inputs = [];


      for (var i = 0; i < this.maxCount; i++){

        let boxID = "Input"+(i+1);
        if (i >= this.currCount ) {
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

     let interval = 100;

     // animation for the boxes
      for(let i = 1; i <= this.currCount; i++){


        setTimeout(() => {
            document.getElementById("Input"+i).style.backgroundColor="red"
          },
          interval*i);

// restoring the colors
          if (i > 1) {
            setTimeout(() => {
                document.getElementById("Input"+(i-1)).style.backgroundColor="inherit"
              },
              interval*i);
          }

          // coming back up (reversed order)
          setTimeout(() => {
              document.getElementById("Input"+(this.currCount-i+1)).style.backgroundColor="red"
            },
            (interval * (this.currCount + i-1)));

          // restoring the colors again
          if ((this.currCount - i + 2) > 0 && (this.currCount - i + 2) <= this.currCount) {
            setTimeout(() => {
                document.getElementById("Input"+(this.currCount-i+2)).style.backgroundColor="inherit"
              },
              (interval * (this.currCount + i-1)));
            }
      }

      ReactDOM.render("pickOne()", document.getElementById('placeholder'));
    /*  setTimeout(() => {
          document.getElementById("Input1").style.backgroundColor="red"
        },
        1500);

*/

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
