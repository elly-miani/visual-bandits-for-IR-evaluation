import React, { useState, useEffect, Component } from 'react';
import * as d3 from "d3";
import logo from './logo.svg';
import './App.css';

function App() {

	const [currentTime, setCurrentTime] = useState(0);

	useEffect(() => {
		fetch('/api/time').then(res => res.json()).then(data => {
			setCurrentTime(data.time);
		})
	}, []);

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

			<BarChart />
		</div>
	);
}

export default App;

class BarChart extends Component {
	componentDidMount() {
		this.drawChart();
	}

	drawChart() {
		const data = [12, 5, 6, 6, 9, 10];
		var w = 700;
		var h = 300;

		const svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.style("margin-left", 100);

		svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", (d, i) => i * 70)
			.attr("y", (d, i) => h - 10 * d)
			.attr("width", 65)
			.attr("height", (d, i) => d * 10)
			.attr("fill", "green")
	}

	render() {
		return <div id={"#" + this.props.id}></div>
	}
}