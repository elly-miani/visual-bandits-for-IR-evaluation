import React, { useRef, useEffect, useState } from 'react'

import './GridChart.css';

import printLog from '../../core/helper/printLog.js';
import useResizeObserver from '../../core/hooks/useResizeObserver.js';

import drawChart from './drawChart';
import getGridData from './getGridData';
import updateRetrievedDocs from './updateRetrievedDocs.js';
import updateRetrievedDoc from './updateRetrievedDoc.js';


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

	const [gridState, setGridState] = useState(getGridData(props.runs, props.qrels, props.runsList, printLogHelper.current));

	const [history, setHistory] = useState([]);
	var cloneDeep = require('lodash.clonedeep');

	// when data is updated, recreate the grid
	useEffect(() => {
		setGridState(getGridData(props.runs, props.qrels, props.runsList, printLogHelper.current));
	}, [props.runs, props.qrels]);


	// when the retrievedDocs list is updated, update the grid
	useEffect(() => {
		if (!props.retrievedDocs) return;

		if (props.adjudicationAutoplay.lastStep === 'next') {
			if (history.length <= props.adjudicationAutoplay.status) {

				let grid = updateRetrievedDoc(gridState, props.retrievedDocs[props.adjudicationAutoplay.status], props.runsList, printLogHelper.current);

				setHistory(history => {
					history.push(cloneDeep(grid))
					return history
				})

				setGridState(cloneDeep(grid));
			}
			else {
				setGridState(history[props.adjudicationAutoplay.status])
			}
		}
		else {
			setGridState(history[props.adjudicationAutoplay.status])
		}
	}, [props.adjudicationAutoplay])


	useEffect(() => {
		if (!props.retrievedDocs) return;

		let grid = updateRetrievedDoc(gridState, props.retrievedDocs[props.adjudicationAutoplay.status], props.runsList, printLogHelper.current);

		let history = []
		history.push(cloneDeep(grid))
		setHistory(history)

		setGridState(cloneDeep(grid));

	}, [props.retrievedDocs])


	// when the grid is recreated, redraw the chart
	useEffect(() => {
		if (!dimensions) return;
		// printLog("HOOK", "useEffect(), [gridState]", null, printLogHelper.current);
		// printLog("PRINT", "gridState: ", gridState, printLogHelper.current);
		drawChart(gridState, props.runSize, props.runsList, svgRef.current, dimensions, printLogHelper.current);
	}, [gridState, dimensions, props.runSize]);


	return (
		<div className="container offset">
			<div id="wrapper--GridChart" ref={wrapperRef}>
				<svg ref={svgRef}>
				</svg>
			</div>
		</div>
	)
}