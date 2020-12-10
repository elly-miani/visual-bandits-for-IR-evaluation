import React, { useState, useEffect } from 'react';
import ExampleChart from "./components/example-chart/example-chart"

import logo from './assets/logo.svg';
import './assets/App.css';
import useFetch from './components/example-chart/hooks.js'

function App() {

	const [currentTime, setCurrentTime] = useState(0);

	useEffect(() => {
		fetch('/api/time').then(res => res.json()).then(data => {
			setCurrentTime(data.time);
		})
	}, []);

	// let url = '/api/time';
	// setCurrentTime(useFetch(url));

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
        </p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
        </a>
				<p>
					The current time is {currentTime}.
				</p>
			</header>

			<ExampleChart />
		</div>
	);
}

export default App;