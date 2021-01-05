import React, { useState } from 'react'

// import logo from './assets/logo.svg';
import './assets/App.css';

// import Time from './components/time/Time'
// import ExampleChart from "./components/exampleChart/exampleChart"
import ExampleChart2 from './components/exampleChart2/exampleChart2';


function App() {
	console.log("➡️ Rendering App()");
	
	const [state, setState] = useState(100);
	const [mockData, setMockData] = useState([25, 30, 23, 60, 44, 32, 56, 34, 12, 62, 33]);

	function updateState() {
		setState(prevState => prevState - 1)
	}

	return (
		<div className="App">
			{/* <header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />

				<p>
					Current state: {state}
				</p>
				<button onClick={updateState}>
					Refresh main App()
				</button>

				<Time />
			</header> */}
			<ExampleChart2 data={mockData} />

			<br /><br /><br /><br />

			<button onClick={() => setMockData(mockData.map(value => value + 5))}>
				Update data
			</button>
			<button onClick={() => setMockData(mockData.filter(value => value < 35))}>
				Filter data
			</button>
			<button onClick={() => setMockData([...mockData, Math.round(Math.random() * 100)])}>
				Add data
			</button>

			{/* <ExampleChart /> */}
		</div>
	);
}

export default App;