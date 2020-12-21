import React, { useState } from 'react'

import ExampleChart from "./components/exampleChart/exampleChart"
import Time from './components/time/Time'

import logo from './assets/logo.svg';
import './assets/App.css';


function App() {
	console.log("➡️ Rendering App()");
	
	const [state, setState] = useState(100);

	function updateState() {
		setState(prevState => prevState - 1)
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />

				<p>
					Current state: {state}
				</p>
				<button onClick={updateState}>
					Refresh main App()
				</button>

				<Time />
			</header>

			<ExampleChart />
		</div>
	);
}

export default App;