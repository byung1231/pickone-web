import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';


class App extends React.Component{

  constructor(props){

    super(props);

    this.defaultCount = 3;
    this.maxCount = 20;
    this.minCount = 2;
    this.secondaryColor = "brown"//"#026BAB"
    this.lastRandomNumber = 0; // used to reset the input box color for the next run

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

  generateRandomNumber = () => {

var randomRaw = Math.random()
    var random = 1 + (randomRaw * (this.state.count-1));
    // adding 1 b/c minimum has to be 1 (input box IDs start from 1)
    // subtracing 1 b/c the max has to be this.state.count (e.g. 3)

    ReactDOM.render("randomRaw: " + randomRaw, document.getElementById('test'));

    return Math.round(random);
  }


   pickOne = () =>{

     this.setState({running:true});

     // reset the color for the last chosen box, if not being ran for the first time
     if(this.lastRandomNumber > 0){
        document.getElementById("Input"+this.lastRandomNumber).style.backgroundColor="inherit"
     }


     let count = 0
     //let interval = 100 + (this.currCount * count)
     let interval = 100
     let numOfLoops = 5
     let currCount = this.state.count;
     let randomNumber = this.generateRandomNumber()

     // decreasing the number of animations depending on the # of choices
     switch (true){
       case (currCount >= 10):
          numOfLoops = 3;
          break;
       case (currCount >= 5):
          numOfLoops = 4;
          break;
     }

     // animation for the boxes
     while (count < numOfLoops) {

       let startTime = interval * ((this.state.count * 2 * count)-(2*count))
        //take 2 out from the times for first and last boxes (since they are only visited once)

      setTimeout(() => {
          // ReactDOM.render("currCount: " + this.state.count + ", startTime: " + startTime.toString(), document.getElementById('placeholder'));
           ReactDOM.render("rand: " + randomNumber, document.getElementById('placeholder'));
         },
         startTime);


         //NEW APPROACH: SEPARATE GOING UP AND down

         // going down
         for(let i = 0; i < currCount; i++){

            // Step 1: Change color (going down)
           if (i < currCount - 1){

             setTimeout(() => {
               document.getElementById("Input"+(i+1)).style.backgroundColor=this.secondaryColor

             },
             startTime + interval*i);

           }

           // Step 2: restore color for the previous box
           if (i > 0) {
             setTimeout(() => {
                 document.getElementById("Input"+i).style.backgroundColor="inherit"
               },
               startTime + interval*i);
           }
         }

        startTime += interval*(currCount-2)

         // going back up
         for(let i = currCount; i > 0; i--){


           // Step 3: Change color (coming back up from the bottom)
           setTimeout(() => {
               document.getElementById("Input"+i).style.backgroundColor=this.secondaryColor
             },
             startTime + (interval * (currCount - i + 1))
           )
             // subtracting 1 at the end, for the bottom box, b/c otherwise the time would be double counted
             // b/c the bottom box is executed twice from steps 1 and 3.
             // so that means e.g. if count = 3, and if we dont subtract -1,
             // then it would be executed both for both times: interval * 3 (i = 0; step 3) and interval * 2 (i = 2; step 1)



           // Step 4: Restore the color again
           if ((i + 1) <= currCount) {
             setTimeout(() => {
                 document.getElementById("Input"+(i+1)).style.backgroundColor="inherit";
               },
             startTime +  (interval * (currCount - i+1))
           )
         }


           if ((count == numOfLoops - 1) && ( i == randomNumber )){
ReactDOM.render("i: " + i, document.getElementById('placeholder'));
             break;
           }

         }
     // re-enabling the buttons after all the actions
           // only run once
           if((count == numOfLoops - 1)){// && (i == currCount + 1)){
             setTimeout(() => {
                 this.setState({running:false})
               }
               ,
               startTime + (currCount * interval * 2))
           }


           count += 1;


       } //end of the while loop

       this.lastRandomNumber = randomNumber


    }


  render(){
    return(
      <div>
        <div id="sideButtons">
          <ul class="sideButtonsList">
            <li><button type="button" class="sideButton" onClick={this.incrementCount} disabled={!this.state.enableIncrement || this.state.running}>+</button></li>
            <li id="lblCount">{this.state.count}</li>
            <li><button type="button" class="sideButton" onClick={this.decrementCount} disabled={!this.state.enableDecrement || this.state.running}>-</button></li>
          </ul>
        </div>
        <div id="form">
          {this.generateForms()}
        </div>
        <div class="clearer"></div>

        <div id="pickButtonDiv">
          <button type="button" class="pickButton" onClick={this.pickOne} disabled={this.state.running}>Pick One!</button>
        </div>
    </div>
    );

  }

}


export { App};
