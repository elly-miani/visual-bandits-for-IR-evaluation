import React, { useState, Fragment } from 'react';
// import * as d3 from "d3";

import useFetch from './hooks.js';

function ExampleChart() {

	let url = '/api/data'
	const { status, data } = useFetch(url);

	console.log(data, status, url);


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