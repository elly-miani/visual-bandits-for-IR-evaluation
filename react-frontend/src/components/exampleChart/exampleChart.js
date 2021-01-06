import React, { useEffect, useRef, Fragment } from 'react'
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from 'd3'; 

import './ExampleChart.css';

import printLog from '../../core/helper/printLog.js';
import useResizeObserver from '../../core/hooks/useResizeObserver.js';

function ExampleChart2({data}) {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const renderCount = useRef(1);
	const verbosity = 0;

	useEffect(() => {
		renderCount.current = renderCount.current + 1;
		printLog("RENDER", null, null, "ExampleChart2()", renderCount.current, verbosity);
	})
	// == == == == == == == == == == == == == == == == == == == //

	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);

	useEffect(() => {

		const svg = select(svgRef.current)

		if(!dimensions) return;

		// scales
		const xScale = scaleBand()
			.domain(data.map((d,i) => i))
			.range([0, dimensions.width])
			.padding(0.2);

		const yScale = scaleLinear()
			.domain([0, Math.max(...data)])
			.range([dimensions.height, 0]);

		const colorScale = scaleLinear()
			.domain([0, Math.max(...data) / 3, Math.max(...data)/3*2, Math.max(...data)])
			.range(["#02DFF4", "#28EADD", "#5DF1BD", "#94F5A6"])
			.clamp(true);
		
		// axis
		const xAxis = axisBottom(xScale).ticks(data.length).tickFormat(i => i+1);
		svg.select(".x-axis").style("transform", `translateY(${dimensions.height}px)`).call(xAxis);

		const yAxis = axisLeft(yScale);
		svg.select(".y-axis").call(yAxis);
		

		svg			
			.selectAll(".bar")
			.data(data)
			.join("rect")
			.attr("class", "bar")
			// tooltip on hover
			.on("mouseenter", (event, d) => {				
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
			.attr("x", (d, i) => xScale(i))																// distance b/w bars
			.attr("y", (d, i) => yScale(d))																// offset from bottom
			.attr("width", xScale.bandwidth())														// bars' width
			.attr("height", (d, i) => dimensions.height - yScale(d))			// bars' height
			.attr("fill", colorScale);																		// bars' color
	}, [data, dimensions])

	return (
		<div id="wrapper--ExampleChart" ref={wrapperRef}>
			<svg ref={svgRef}>
				<g className="x-axis"></g>
				<g className="y-axis"></g>
			</svg>
		</div>
	)
}

export default ExampleChart2;