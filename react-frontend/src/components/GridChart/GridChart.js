import React, { useRef, useEffect, useState } from 'react'

import printLog from '../../core/helper/printLog.js';
// import useResizeObserver from '../../core/hooks/useResizeObserver.js';
import createGridData from './createGridData';
import drawChart from './drawChart';

import './GridChart.css';

export default function GridChart({data}) {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "GridChart()",
		verbosity: [1, 1, 1, 1, 1],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //

	const svgRef = useRef();
	const wrapperRef = useRef();
	// const dimensions = useResizeObserver(wrapperRef);

	const [gridState, setGridState] = useState(createGridData(data, printLogHelper.current));

	useEffect(() => {
		printLog("HOOK", "useEffect()", null, printLogHelper.current);
		// printLog("PRINT", "gridData: ", gridState, printLogHelper.current);

		drawChart(gridState, setGridState, svgRef.current, printLogHelper.current);
	}, [gridState]);

	return (
		<div id="wrapper--GridChart" ref={wrapperRef}>
			<svg ref={svgRef}>
			</svg>
		</div>
	)
}
