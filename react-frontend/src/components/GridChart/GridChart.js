import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'; 

import printLog from '../../core/helper/printLog.js';
// import useResizeObserver from '../../core/hooks/useResizeObserver.js';

import './GridChart.css';


function createGridData(data, printLogHelper) {
	var gridData = [];
	var click = 0;

	// identify the max rank value in the data
	var totRanks = 0;
	for (const [key] of Object.entries(data)) {
		totRanks++;
	}	

	// identify how many runs there are and their names
	var run_names = []
	for (const [key] of Object.entries(data[1])) {
		run_names.push(key);
	}
	var totRuns = run_names.length;

	// iterate for each rank (row in the grid)	
	for (var rank = 0; rank < totRanks; rank++) {
		gridData.push([]);
		var rank_data = data[rank+1];									// +1 b/c the ranks start from 1

		// iterate for each run (cell inside row)
		for (var run = 0; run < totRuns; run++) {
			var document_data = rank_data[run_names[run]];

			if (!document_data) {
				gridData[rank].push({
					row: rank,
					column: run,
					document: null,
					query: null,
					score: null,
					topic: null,
					click: click
				})
			}
			else {
				gridData[rank].push({
					row: rank,
					column: run,
					document: document_data.DOCUMENT,
					query: document_data.QUERY,
					score: document_data.SCORE,
					topic: document_data.TOPIC,
					click: click
				})
			}
		}
	}
	return 	{
						gridData: gridData, 
						totRanks: totRanks,
						totRuns: totRuns
					};
}


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
		printLog("FUNCTION_CALL", "useEffect()", null, printLogHelper.current);
		printLog("PRINT", "gridData: ", gridState, printLogHelper.current);

		// if (!dimensions) return;
		const grid = d3.select(svgRef.current);
		grid.attr("height", gridState.totRanks * (50+10) + 10 + "px");
		grid.attr("width", gridState.totRuns * (50+10) + 10 + "px");
		
		const colorScale = d3.scaleLinear()
			.domain([0, 1, 2, 3, 4])
			.range(["#DDEAFD", "#02DFF4", "#28EADD", "#5DF1BD", "#94F5A6"])
			.clamp(true);

		var row = grid.selectAll(".row")
			.data(gridState.gridData)
			.join("g")
			.attr("class", "row");

		// var column = 
		row.selectAll(".square")
			.data(function (d) { return d; })
			.join("rect")
			.attr("class", "square")
			.attr("x", function (d) { return 1 + 10 + (50 + 10) * d.column; })
			.attr("y", function (d) { return 1 + 10 + (50 + 10) * d.row; })
			.attr("width", "50px")
			.attr("height", "50px")
			.style("fill", function (d) { 
				return colorScale(d.click); 
			})
			.style("stroke", "#F2F4F8")
			.on("click", function (event, d) {
				// printLog("PRINT", "Click data: ", d, printLogHelper.current);
				// printLog("PRINT", "Click event: ", event, printLogHelper.current);
				// 1. Make a shallow copy of the items
				let temp_gridData = [...gridState.gridData];
				// 2. Make a shallow copy of the item you want to mutate
				let temp_cell = { ...temp_gridData[d.row][d.column] };
				// 3. Replace the property you're intested in
				temp_cell.click = temp_cell.click + 1;
				// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
				temp_gridData[d.row][d.column] = temp_cell;
				// 5. Set the state to our new copy
				setGridState( prevState => {
					return {...prevState, gridData: temp_gridData}
				});
			})
			// tooltip on hover
			.on("mouseenter", (event, d) => {
				// printLog("PRINT", "on mousenter, d: ", d.document, printLogHelper.current);
				grid
					.selectAll(".tooltip")
					.data([d])
					.join(enter => enter.append("text").attr("y", 0))
					.attr("class", "tooltip")
					.text("DOC: " + d.document + "  SCORE: " + d.score + "  QUERY: " + d.query + "  TOPIC: " + d.topic)
					.attr("x", "200px")
					.transition()
					.attr("y", 0)
					.attr("text-anchor", "middle")
					.attr("opacity", 1);
			})
			.on("mouseleave", () => {
				grid.select(".tooltip").remove();
			});

	}, [gridState]);

	return (
		<div id="wrapper--GridChart" ref={wrapperRef}>
			<svg ref={svgRef}>
			</svg>
		</div>
	)
}
