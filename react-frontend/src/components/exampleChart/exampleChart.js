import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';
import * as d3 from "d3";

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

function ExampleChart() {

	const renderCount = useRef(1);
	const verbosity = 1;

	useEffect(() => {
		renderCount.current = renderCount.current + 1;
		printLog("RENDER", null, null, "ExampleChart()", renderCount.current, verbosity);
		// console.table(data);
	})
	
	const [url, setUrl] = useState('/api/data')
	const [urlcontrol, setUrlControl] = useState(1);
	const [data, setData] = useState([]);
	printLog("PRINT", "Data at render is", data, "ExampleChart()", renderCount.current, verbosity);
	

	const updateData = useCallback(() => {
		fetchAPI(url, res => {
			setData(res);
		});
	}, [url]);


	const onButtonClick = () => {
		printLog("PRINT", "urlcontrol =", urlcontrol, "onButtonClick()", renderCount.current, verbosity);

		if(urlcontrol) {
			setUrlControl(0);
			setUrl('/api/data2'); 
		}
		else {
			setUrlControl(1);
			setUrl('/api/data');
		}
	};

	useEffect(() => {
		updateData();
	}, [updateData]);

	useEffect(() => {
		// console.log("📗 Data when drawing is ", data);
		drawChart(data);
		
		return () => {
			// console.log("🧨 Deleting drawing container ");
			d3.select("#chart-container").selectAll("*").remove();
		}
	}, [data]);

	

	function drawChart(chartData) {

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
			{/* <h1>Attempt</h1>
			<div>
				{
					data.map(data => (
						<div key={data.doc}>{data.score}</div>
					))
				}
			</div> */}
			<div id="chart-container"></div>
			<button onClick={onButtonClick}>
				Update data
			</button>
		</Fragment>
	)
}

export default ExampleChart;