import React, { useState, useEffect, Fragment } from 'react';
import * as d3 from "d3";

function ExampleChart() {

	// const[jsonData, setJsonData] = useState(0);
	const [status, setStatus] = useState('idle');
	const [data, setData] = useState([]);

	// simple method with no status control
	// useEffect(() => {
	// 	fetch('/api/data').then(res => res.json()).then(data_retrieved => {
	// 		setData(data_retrieved.run);
	// 	})
	// }, []);

	// more complicated method with status control
	useEffect(() => {

		const fetchData = async () => {
			setStatus('fetching');

			const response = await fetch(
				'/api/data'
			);

			const data_retrieved = await response.json();
			console.log(data_retrieved.run);
			setData(data_retrieved.run);
			setStatus('fetched');
		};

		fetchData();

		// drawChart();

	}, []);

	// function drawChart() {
	// 	const data = jsonData;
	// 	console.log(data);
	// 	var w = 700;
	// 	var h = 300;

	// 	const svg = d3.select("body")
	// 		.append("svg")
	// 		.attr("width", w)
	// 		.attr("height", h)
	// 		.style("margin-left", 100);

	// 	svg.selectAll("rect")
	// 		.data(data)
	// 		.enter()
	// 		.append("rect")
	// 		.attr("x", (d, i) => i * 70)
	// 		.attr("y", (d, i) => h - 10 * d)
	// 		.attr("width", 65)
	// 		.attr("height", (d, i) => d * 10)
	// 		.attr("fill", "green")
	// }


	return (
		<Fragment>
			<h1>Attempt</h1>
			<div>
				{
					data.map(data => (
						<div key={data.doc}>{data.score}</div>
					))
				}
			</div>
		</Fragment>
	)
}

export default ExampleChart;