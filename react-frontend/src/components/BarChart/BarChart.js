import React, { useState, useEffect, useRef } from 'react'
import { CheckboxGroup, Checkbox } from "rsuite";

import './BarChart.css';

import printLog from '../../core/helper/printLog.js';
import useResizeObserver from '../../core/hooks/useResizeObserver.js';

import drawChart from './drawChart.js'
import getChartData from './getChartData.js'


function BarChart(props) {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "BarChart()",
		verbosity: [0, 1, 1, 1, 0],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
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

	const [chartData, setChartData] = useState(null);
	const [state, setState] = useState({value: []})



	useEffect(() => {
		printLog("HOOK", "useEffect([props.runRelevancies])", null, printLogHelper.current);

		setChartData(getChartData(props.runRelevancies, state, printLogHelper))
		// console.log(JSON.stringify(chartData, null, 2))
	}, [props.runRelevancies, state])



	useEffect(() => {
		printLog("HOOK", "useEffect([chartData, dimensions])", null, printLogHelper.current);

		if(!dimensions) return;

		// identify how many runs there are and their names
		var runNames = []
		for (let key in props.runRelevancies[props.runRelevancies.length - 1]) {
			runNames.push(key);
		}

		drawChart(chartData, runNames, svgRef.current, dimensions, printLogHelper)
	}, [chartData, dimensions])



	return (
		<div id="wrapper--BarChart" ref={wrapperRef}>
			<svg ref={svgRef}>
				<g className="x-axis"></g>
				<g className="y-axis"></g>
			</svg>

			<div className="controls">
				<CheckboxGroup
					inline
					name="checkboxList"
					value={state.value}
					onChange={value => {
						if(value.includes("REL-NONREL")) {
							setState({ value });
						}
						else{
							setState({ value: [] })
						}
					}}
				>
					Highlight:
					<Checkbox value="REL-NONREL">
						Relevant/Nonrelevant
					</Checkbox>
					<Checkbox value="UNIQUE-REL" disabled={!state.value.includes("REL-NONREL")}>
						Unique Relevant
					</Checkbox>
				</CheckboxGroup>
			</div>
		</div>
	)
}

export default BarChart;