import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'; 

import './BarChart.css';

import printLog from '../../core/helper/printLog.js';
import useResizeObserver from '../../core/hooks/useResizeObserver.js';
import drawChart from './drawChart.js'

function BarChart(props) {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "BarChart()",
		verbosity: [1, 1, 1, 1, 0],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //

	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef, printLogHelper.current);


	useEffect(() => {
		printLog("HOOK", "useEffect([props.runRelevancies, dimensions])", null, printLogHelper.current);

		if(!dimensions) return;

		let runRelevanciesLast = props.runRelevancies[props.runRelevancies.length - 1];

		let chartData = Object.entries(runRelevanciesLast).map(d => {
			return {
				'RUN': d[0],
				'REL_UNIQUE': d[1].REL_UNIQUE,
				'REL_NON_UNIQUE': d[1].REL - d[1].REL_UNIQUE,
				'NON_REL': d[1].NON_REL
			};
		})

		// console.log(JSON.stringify(chartData, null, 2))

		drawChart(chartData, runRelevanciesLast, svgRef.current, dimensions, printLogHelper)
		
	}, [props.runRelevancies, dimensions])

	return (
		<div id="wrapper--BarChart" ref={wrapperRef}>
			<svg ref={svgRef}>
				<g className="x-axis"></g>
				<g className="y-axis"></g>
			</svg>
		</div>
	)
}

export default BarChart;