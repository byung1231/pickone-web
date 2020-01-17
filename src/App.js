import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

const Style ={

  inputOdd : "inputOdd",
  inputEven : "inputEven",
  picked: "picked",
  inputLast : "inputLast"

};

// Simplified version - no overflowing boxes
class App extends React.Component{

  constructor(props){

    super(props);

    this.defaultCount = 3;
    this.maxCount = 10;
    this.minCount = 2;
    this.lastRandomNumber = 0; // used to reset the input box color for the next run
    this.inputValues = new Array(this.maxCount);
    this.refArray = new Array(this.maxCount+1); // used to validate inputs in the boxes

    this.state = { count: this.defaultCount,
                  enableIncrement: true,
                  enableDecrement: true,
                  animationActive:false,
                  isRunning: false,
                  hasValidInputs: false
                };

  }

  changeCount = (type) => {

    let newCount = this.state.count;

    switch(true){
      case(type == "increment"):
        newCount += 1;
        document.getElementById("Input"+newCount).setAttribute("type","text");
        break;

      case(type == "decrement"):
        // must hide the last box BEFORE decreasing the count
        document.getElementById("Input"+newCount).setAttribute("type","hidden");
        newCount -= 1;
        break;
    }

    // increment button
    if (newCount >= this.maxCount) {
        this.setState({enableIncrement: false});
    }
    else{
        this.setState({enableIncrement: true});
    }

    // decrement button
    if (newCount <= this.minCount) {
      this.setState({enableDecrement: false});
    }
    else{
      this.setState({enableDecrement: true});
    }


    this.setState({count:newCount});

    // REMOVE FOR PROD
    ReactDOM.render(<p>showing/hiding Input{newCount}, type:{type}</p>, document.getElementById('placeholder'));
      //  document.getElementById("Input"+newCount).setAttribute("type","text");


  }



  // keeping track of user inputs to validate them later
  handleChange(e) {
    let inputID = e.target.id.substring(5)
    let inputText = e.target.value


      this.inputValues[inputID]=  e.target.value

      if(!this.validateInputs()){
        this.setState({hasValidInputs:false})

      }
      else{
        this.setState({hasValidInputs:true})
      }

   }

// generates input boxes
  generateInputBoxes = () => {
      const inputs = [];
      const div = []; // dummy div to scroll the container programatically

      for (var i = 1; i <= this.maxCount; i++){

        let boxID = "Input"+(i);
        let boxType = "text";
        let boxClass = Style.inputOdd;

        let divID = "Div"+(i);

        // hiding the boxes that are....
        if (i > this.state.count ){
          boxType = "hidden"
        }

        // alternating color schemes for boxes
        if (i % 2 == 0){
          boxClass = Style.inputEven
        }

        // remove bottom border for the very last box for cleaner look
        if (i == this.maxCount){
          boxClass += " " + Style.inputLast
        }

        this.refArray[i] = React.createRef();

        inputs.push(<input type={boxType}  class={boxClass} id={boxID} onChange={this.handleChange.bind(this)} disabled={this.state.isRunning}
        ref ={this.refArray[i]} //{(ref) => {this.refArray[i] = ref}}
      /*  onKeyPress={event => {
              this.handleKeyPress(event)

            }}*/
            onKeyDown = {this.handleKeyPress}
              ></input>);
            //  ReactDOM.render(<p>ref:{this.currRef}</p>, document.getElementById('placeholder'));

      }
      return(
        <form>{inputs}</form>
      )



  }


  generatePickButton = () => {

    let btnClass = "pickButton"

    // should still respond to onclick when disalbed, alering users of invalid inputs
    if(!this.validateInputs()){
      btnClass += " invalid"
    }

    return(
        <button type="button" class={btnClass} onClick={this.pickOne} disabled={this.state.isRunning}>Pick One!</button>
    )

  }

  // up = 38
  // down= 40
  // if e.keyCode == '38'
  // tab key : (e.key === 'Tab')

// tab is already handled by browesers - no need to add
  handleKeyPress = (e) => {

    let i = parseInt(e.target.id.substring(5))

        if ((e.key === 'Enter') || (e.keyCode == '40')) {

          // enter key and last input box
          if((e.key === 'Enter') && (i == this.state.count)&& (i < this.maxCount)) {
            this.changeCount("increment")

          }

          if(i < this.maxCount){
              this.refArray[i+1].current.focus()
          }

      }

      else if((e.keyCode == '38') && (i > 1)){

        this.refArray[i-1].current.focus()


      }





    ReactDOM.render(<p>i:{i}</p>, document.getElementById('placeholder'));




  }

  resetInputStyles = () => {

    for(let i = 1; i <= this.maxCount; i++){

      let boxClass = Style.inputOdd

      if (i % 2 == 0){
        boxClass = Style.inputEven
      }
      // remove bottom border for the very last box for cleaner look
      if (i == this.maxCount){
        boxClass += " " + Style.inputLast
      }

      document.getElementById("Input"+i).setAttribute("class", boxClass);

    }

  }

  // validates inputs in all boxes and changes states accordingly
  validateInputs = () => {

    let isEmpty = true;

    for(const input of this.inputValues){
      if(input != null && input.length > 0){
        isEmpty = false
      }
    }

    // if isEmpty, returns false (inputs are invalid)
    return !isEmpty


  }

  // generates random number between 1 and current box count
  generateRandomNumber = () => {

    var randomRaw = Math.random()
    var random = 1 + (randomRaw * (this.state.count-1));
    // adding 1 b/c minimum has to be 1 (input box IDs start from 1)
    // subtracing 1 b/c the max has to be this.state.count (e.g. 3)

    ReactDOM.render("randomRaw: " + randomRaw, document.getElementById('test'));

    return Math.round(random);
  }


  deleteAll = () => {

    // maybe add a title to the alert box? -> NOT PSOSIBLE
    if(window.confirm("Are you sure?")){

      for(let i=1; i<=this.maxCount; i++){
          this.inputValues[i] = ""
          document.getElementById("Input"+i).value = ""
      }
    }
  }


  // main actions
   pickOne = () =>{

     if(!this.validateInputs()){
       alert("Please check your inputs!");

     }
     else{
       this.setState({isRunning:true});

       this.resetInputStyles();

       // reset the color for the last chosen box, if not being ran for the first time

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

         let startTime = interval * ((currCount * 2 * count)-(2*count))
          //take 2 out from the times for first and last boxes (since they are only visited once)

          //end time to reset the state back to !isRunning and re-enable the buttons - will be set at the end of the cycle
        let endTime = 0

        setTimeout(() => {
            // ReactDOM.render("currCount: " + this.state.count + ", startTime: " + startTime.toString(), document.getElementById('placeholder'));
             ReactDOM.render("rand: " + randomNumber, document.getElementById('placeholder'));
           },
           startTime);


           // Separating going down and up

           // going down
           for(let i = 0; i < currCount; i++){

             let boxClass = Style.inputOdd


             let divID = "Div"+(i+1)
             let boxID = "Input"+(i+1)
             // alternating color schemes for boxes
             //use i instead of i+1, b/c it is only used to restore previous boxes
             if (i % 2 == 0){
               boxClass = Style.inputEven
             }


              // Step 1: Change color (going down)
             if (i < currCount - 1){

               setTimeout(() => {
                document.getElementById("Input"+(i+1)).setAttribute("class", Style.picked);

               },
               startTime + interval*i);

             }

             // Step 2: restore color for the previous box
             if (i > 0) {
               setTimeout(() => {
                   document.getElementById("Input"+i).setAttribute("class", boxClass);
                  // document.getElementById("Input"+i).style.backgroundColor="inherit";
                 },
                 startTime + interval*i);

                 // if it is the last cycle, save the endtime
                 // must be saved when going down as well, in case the random number is the last one
                 // (i.e. it will not go back up in the last loop)
                  if(count == numOfLoops - 1){// && i == 1){
                     endTime = startTime + (interval * (currCount - i+1))
                   }
             }
           }

          startTime += interval*(currCount-2)

           // going back up
           for(let i = currCount; i > 0; i--){

             let boxClass = Style.inputOdd
             let boxClassPicked = Style.picked
             let lastInputBox = "" // class for the very last input box (with the bottom border disabled)
             // only needed when going back up, b/c it is visited only once when going back up

             // alternating color schemes for boxes
             //use i+1 instead of i+1, b/c it is only used to restore previous boxes
             if ((i+1) % 2 == 0){
               boxClass = Style.inputEven
             }

             // remove bottom border for the very last box for cleaner look
             if (i  == this.maxCount){
               //lastInputBox = " " + Style.inputLast
               boxClassPicked += (" " + Style.inputLast)
             }

          //   boxClass += lastInputBox

             // Step 3: Change color (coming back up from the bottom)
             setTimeout(() => {
                      document.getElementById("Input"+i).setAttribute("class", boxClassPicked); //.style.backgroundColor=this.secondaryColor
               },
               startTime + (interval * (currCount - i + 1))
             )
               // subtracting 1 at the end, for the bottom box, b/c otherwise the time would be double counted
               // b/c the bottom box is executed twice from steps 1 and 3.
               // so that means e.g. if count = 3, and if we dont subtract -1,
               // then it would be executed both for both times: interval * 3 (i = 0; step 3) and interval * 2 (i = 2; step 1)

               // must be called again when restoring
               if (i + 1 == this.maxCount){
                 lastInputBox = " " + Style.inputLast
               }

             // Step 4: Restore the color again
             if ((i + 1) <= currCount) {
                 setTimeout(() => {
                     document.getElementById("Input"+(i+1)).setAttribute("class", boxClass + lastInputBox);
                   },
                 startTime +  (interval * (currCount - i+1))
               );
              // if it is the last cycle, save the endtime
               if(count == numOfLoops - 1){// && i == 1){
                  endTime = startTime + (interval * (currCount - i+1))

                /*  setTimeout(() => {
                      this.setState({isRunning:false})
                    }
                    ,interval)*/
               }
           }



            // Stop at the random number
             if ((count == numOfLoops - 1) && ( i == randomNumber )){
  // REMOVE FOR PROD
  ReactDOM.render("i: " + i, document.getElementById('placeholder'));
          setTimeout(() => {
                this.setState({isRunning:false})
              }
              ,endTime + interval)
               break;
             }

           }


       // re-enabling the buttons after all the actions
             // only run once
             if((count == numOfLoops - 1)){// && (i == currCount + 1)){
          /*     setTimeout(() => {
                   this.setState({isRunning:false})
                 }
                 ,endTime)*/
                 //startTime + (currCount * interval * 2))
             }


             count += 1;


         } //end of the while loop

         this.lastRandomNumber = randomNumber
     }




    }


  render(){
    return(
      <div>
      <div id="midRowDiv">
        <div id="sideButtonsLeftDiv" class="sideButtonsDiv">
          <ul class="sideButtonsList">
            <li><button type="button" class="sideButton" onClick={()=>this.changeCount("increment")}  disabled={!this.state.enableIncrement || this.state.isRunning}>+</button></li>
            <li id="lblCount">{this.state.count}</li>
            <li><button type="button" class="sideButton" onClick={()=>this.changeCount("decrement")} disabled={!this.state.enableDecrement || this.state.isRunning}>-</button></li>
          </ul>
        </div><div id="form">
          {this.generateInputBoxes()}
        </div><div id="sideButtonsRightDiv">
          <ul class="sideButtonsList">
            <li><button type="button" class="sideButton" onClick={this.deleteAll} disabled={this.state.isRunning || !this.state.hasValidInputs}>D</button></li>
          </ul>
        </div>
      </div>
        <div class="clearer"></div>

        <div id="pickButtonDiv">
        {this.generatePickButton()}

        </div>
    </div>
    );

  }

}


export { App};
