import React, { useState, useEffect, useRef, Fragment } from 'react'
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from 'd3'; 

 import printLog from '../../core/helper/printLog.js';


function ExampleChart2() {

	// const renderCount = useRef(1);
	// const verbosity = 4;

	// useEffect(() => {
	// 	renderCount.current = renderCount.current + 1;
	// 	printLog("RENDER", null, null, "ExampleChart2()", renderCount.current, verbosity);
	// })

	const [data, setData] = useState([25, 30, 23, 60, 44, 32, 56, 34, 12, 62, 33]);
	var w = 700;
	var h = 500;

	useEffect(() => {
		const svg = select(svgRef.current)
			.attr("width", w)
			.attr("height", h)
			.style("margin-left", 100);

		// const xScale = scaleLinear()
		// 	.domain([0, data.length])
		// 	.range([0, w]);

		const xScale = scaleBand()
			.domain(data.map((d,i) => i))
			.range([0, w])
			.padding(0.2);

		const yScale = scaleLinear()
			.domain([0, Math.max(...data)])
			.range([h, 0]);

		const colorScale = scaleLinear()
			.domain([0, Math.max(...data)])
			.range(["#B4B3F1", "#300D4F"])
			.clamp(true);
		
		const xAxis = axisBottom(xScale).ticks(data.length).tickFormat(i => i+1);
		svg.select(".x-axis").style("transform", "translateY(500px)").call(xAxis);

		const yAxis = axisLeft(yScale);
		svg.select(".y-axis").call(yAxis);
		
		svg
			// CIRCLES CHART
			// .selectAll("circle")
			// .data(data)
			// .join("circle")
			// .attr("r", value => value)								// radius
			// .attr("cx", value => value * 2)					// x coordinates
			// .attr("cy", value => value * 2)					// y coordinates
			// .attr("stroke", "red");									// circle's margins
			
			// BAR CHART
			.selectAll(".bar")
			.data(data)
			.join("rect")
			.attr("class", "bar")
			// .join(
			// 	enter => enter.append("rect").attr("class", value => value).attr("class", "bar"),
			// 	update => update.attr("class", value => value).attr("class", "bar"),
			// 	exit => exit.remove()
			// )
			.on("mouseenter", (event, d) => {
				// const e = selection.nodes();
				// const i = e.indexOf(this);
				
				svg
					.selectAll(".tooltip")
					.data([d])
					.join(enter => enter.append("text").attr("y", yScale(d) - 20))
					.attr("class", "tooltip")
					.text(d)
					.attr("x", xScale(data.indexOf(d)) + xScale.bandwidth() / 2 )
					.transition()
					.attr("y", yScale(d) - 5 )
					.attr("text-anchor", "middle")
					
					.attr("opacity", 1);
			})
			.on("mouseleave", () => {
				svg.select(".tooltip").remove();
			})
			.transition()
			.attr("x", (d, i) => xScale(i))							// distance b/w bars => i * 70
			.attr("y", (d, i) => yScale(d))							// offset from bottom => h - 10 * d
			.attr("width", xScale.bandwidth())
			.attr("height", (d, i) => h - yScale(d))
			.attr("fill", colorScale);
			// .attr("width", w / data.length - 10)													// bars' thickness
			// .attr("height", (d, i) => d * h / Math.max(...data))
			
	}, [data])

	const svgRef =  useRef();

	return (
		<Fragment>
			<svg ref={svgRef} style={{overflow: "visible"}}>
				<g className="x-axis"></g>
				<g className="y-axis"></g>
			</svg>
			<br /><br /><br /><br />
			<button onClick = {() => setData(data.map(value => value + 5))}>Update data</button>
			<button onClick={() => setData(data.filter(value => value < 35 ))}>Filter data</button>
		</Fragment>
	)
}

export default ExampleChart2;