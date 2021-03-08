import React from 'react'

// Just shows the time, taking app state time as input prop
const Timer = function(props) {
	return (
		<h1 style={{marginRight: 20+'px'}}>
			{props.time}
		</h1>
	);
};

// Resets the timer on click and clear the setInterval
const Reset = function(props) {
	return (
		<button onClick={props.onClickReset} className="reset">
			Reset
		</button>
	);
};


// Pause/ play button
class Control extends React.Component {
	constructor(props) {
		super(props);
	};
  
  onClickHandler = () => {
    if(this.props.paused){
      this.props.start();
    }
    else{
      this.props.stop();
    }
  }
  
	render() {
		return (
				<button className={this.props.paused?"paused":""} onClick={this.onClickHandler}>
		    	{this.props.paused?"play":"pause"}
		    </button>
		);
	};
};


export class Try extends React.Component {
	constructor(props) {
		super(props);
		this.state = { timer: 0, paused: true };
	};
  
  tick = () => {
  	this.setState({ timer : this.state.timer + 1 });
  }
  
	startTimer = () =>{
		this.interval = setInterval(this.tick,1000);
    this.setState({ paused : false });
	}
  
  stopTimer = () => {
  	clearInterval( this.interval );
    this.setState({ paused : true });
	}
  
  reset = () => {
  	this.setState({ timer : 0, paused: true });
    clearInterval( this.interval );
  }
  
	render() {
		return (
			<div>
				<Timer time={this.state.timer}  />
        <Control 
          paused={this.state.paused} 
          start={this.startTimer} 
          stop={this.stopTimer} 
        />
        <Reset  onClickReset={this.reset}/>
			</div>
		);
	};
};

export default Try;
// // CSS Styling
// *{
//   text-align: center;
// }
// #mountNode{
//   height: 400px;
//   background: #f8f8f8;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
// .reset{
//   margin-left: 10px;
//   background: orange;
// }
// button{
//   min-width: 72px;
//   outline: none;
//   border: 0;
//   padding: 10px;
//   text-transform: uppercase;
//   color: white;
//   background: #f44336;
//   cursor: pointer;
//   transition: all .4s ease-in-out;
// }

// .paused{
//   background: #50c950;
// }