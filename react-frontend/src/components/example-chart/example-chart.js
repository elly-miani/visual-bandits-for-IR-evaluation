import React, { Fragment, useEffect, useState } from 'react';
import * as d3 from "d3";

import fetchAPI from '../../core/helper/fetchAPI.js'

function ExampleChart() {

	console.log("➡️ Rendering ExampleChart()");

	let url = '/api/data'
	const [data, setData] = useState([]);
	console.log("📬 Data at render is", data);

	function updateData() {
		fetchAPI(url, res => {
			setData(res);
		});
	}

	useEffect(() => {
		updateData();
		console.log("📬 Initial data fetch");
	}, []);

	useEffect(() => {
		drawChart(data);
		console.log("📬 Data when drawing is ", data);

		return () => {
			console.log("Deleting drawirng container ");
			d3.select("#chart-container").selectAll("*").remove();
		}
	}, [data]);

	

	function drawChart(chartData) {

		console.log("Chart data:", chartData);
		const newdata = chartData.map(data => (data.score))
		var w = 700;
		var h = 300;

		const svg = d3.select("#chart-container")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.style("margin-left", 100);

		svg.selectAll("rect")
			.data(newdata)
			.enter()
			.append("rect")
			.attr("x", (d, i) => i * 70)
			.attr("y", (d, i) => h - 10 * d)
			.attr("width", 65)
			.attr("height", (d, i) => d * 10)
			.attr("fill", "green")
	}


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
			<div id="chart-container" style={{border: "1px solid black"}}></div>
		</Fragment>
	)
}

export default ExampleChart;