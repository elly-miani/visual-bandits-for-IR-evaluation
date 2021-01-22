import React, { useRef, useEffect, useState } from 'react'

import printLog from '../../core/helper/printLog.js';
import useResizeObserver from '../../core/hooks/useResizeObserver.js';
import createGridData from './createGridData';
import drawChart from './drawChart';

import './GridChart.css';

export default function GridChart(props) {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "GridChart()",
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

	const [gridState, setGridState] = useState(createGridData(props.data, props.qrels, printLogHelper.current));

	// printLog("PRINT", "props: ", props.data, printLogHelper.current);

	// when data is updated, recreate the grid
	useEffect(() => {
		// printLog("HOOK", "useEffect(), [data]", null, printLogHelper.current);
		// printLog("PRINT", "data: ", data, printLogHelper.current);
		setGridState(createGridData(props.data, props.qrels, printLogHelper.current));
	}, [props.data]);


	// when the grid is recreated, redraw the chart
	useEffect(() => {
		if (!dimensions) return;
		// printLog("HOOK", "useEffect(), [gridState]", null, printLogHelper.current);
		// printLog("PRINT", "gridState: ", gridState, printLogHelper.current);
		drawChart(gridState, setGridState, svgRef.current, dimensions, printLogHelper.current);
	}, [gridState, dimensions]);

	return (
		<div id="wrapper--GridChart" ref={wrapperRef}>
			<svg ref={svgRef}>
			</svg>
		</div>
	)
}
