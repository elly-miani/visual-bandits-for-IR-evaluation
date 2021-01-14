import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'; 

import printLog from '../../core/helper/printLog.js';
// import useResizeObserver from '../../core/hooks/useResizeObserver.js';

import './GridChart.css';


function createGridData(data, numColumns, numRows) {
	var gridData = [];
	var click = 0;

	// iterate for rows	
	for (var row = 0; row < numRows; row++) {
		gridData.push([]);

		// iterate for cells/columns inside rows
		for (var column = 0; column < numColumns; column++) {
			gridData[row].push({
				row: row,
				column: column,
				document: null,
				query: null,
				score: null,
				topic: null,
				click: click
			})
		}
	}
	return gridData;
}


function updateGridData(data, gridData, numRows, numColumns) {
	var column_values = ['acsys8aln2', 'apl8c221', 'att99atc']
	// printLog("PRINT", "Data updated: ", data, "GridChart()", 1, verbosity);
	// printLog("PRINT", "temp_gridData: ", temp_gridData, "GridChart()", renderCount.current, verbosity);

	// 1. Make a shallow copy of the items
	let temp_gridData = [...gridData];

	// iterate for rows	
	for (var row = 0; row < numRows; row++) {
		let row_data = data[row];

		// iterate for columns
		for (var column = 0; column < numColumns; column++) {

			if (!row_data[column_values[column]]) break;
			// printLog("PRINT", "row_data: ", row_data, "GridChart()", 1, verbosity);

			let column_data = row_data[column_values[column]];
			// printLog("PRINT", "column_data: ", column_data, "GridChart()", 1, verbosity);

			// 2. Make a shallow copy of the item you want to mutate
			let temp_cell = { ...temp_gridData[row][column] };
			// printLog("PRINT", "temp_cell: ", temp_cell, "GridChart()", renderCount.current, verbosity);

			// 3. Replace the property you're intested in
			temp_cell.document = column_data.DOCUMENT;
			temp_cell.query = column_data.QUERY;
			temp_cell.score = column_data.SCORE;
			temp_cell.topic = column_data.TOPIC;

			// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
			temp_gridData[row][column] = temp_cell;
		}
	}

	// 5. Return the new copy that will be set as state
	return temp_gridData
}



export default function GridChart({data}) {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "GridChart()",
		verbosity: [1, 1, 0, 0, 0],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
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
	var numColumns = 3;
	var numRows = 10;

	const [gridData, setGridData] = useState(createGridData(data, numColumns, numRows));

	useEffect(() => {
		printLog("FUNCTION_CALL", "useEffect()", null, printLogHelper.current);
		printLog("PRINT", "gridData: ", gridData, printLogHelper.current);

		// if (!dimensions) return;
		const grid = d3.select(svgRef.current);
		grid.attr("height", numRows * (50+10) + 10 + "px");
		grid.attr("width", numColumns * (200+10) + 10 + "px");
		
		const colorScale = d3.scaleLinear()
			.domain([0, 1, 2, 3, 4])
			.range(["#DDEAFD", "#02DFF4", "#28EADD", "#5DF1BD", "#94F5A6"])
			.clamp(true);

		var row = grid.selectAll(".row")
			.data(gridData)
			.join("g")
			.attr("class", "row");

		// var column = 
		row.selectAll(".square")
			.data(function (d) { return d; })
			.join("rect")
			.attr("class", "square")
			.attr("x", function (d) { return 1 + 10 + (200 + 10) * d.column; })
			.attr("y", function (d) { return 1 + 10 + (50 + 10) * d.row; })
			.attr("width", "200px")
			.attr("height", "50px")
			.style("fill", function (d) { 
				return colorScale(d.click); 
			})
			.style("stroke", "#F2F4F8")
			.on("click", function (event, d) {
				// printLog("PRINT", "Click data: ", d, printLogHelper.current);
				// printLog("PRINT", "Click event: ", event, printLogHelper.current);
				// 1. Make a shallow copy of the items
				let temp_gridData = [...gridData];
				// 2. Make a shallow copy of the item you want to mutate
				let temp_cell = { ...temp_gridData[d.row][d.column] };
				// 3. Replace the property you're intested in
				temp_cell.click = temp_cell.click + 1;
				// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
				temp_gridData[d.row][d.column] = temp_cell;
				// 5. Set the state to our new copy
				setGridData( temp_gridData );
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

			var text = row.selectAll(".label")
				.data(function (d) { return d; })
				.join("text")
				.attr("class", "label")
				.attr("x", function (d) { return 100 + 10 + (200 + 10) * d.column; })
				.attr("y", function (d) { return 32 + 10 + (50 + 10) * d.row; })
				.attr("text-anchor", "middle")
				.text(function (d) { return d.document });

	}, [gridData, numColumns, numRows]);

	useEffect(() => {
		

		// Update the state
		setGridData(updateGridData(data, gridData, numRows, numColumns));

	}, [data]);


	return (
		<div id="wrapper--GridChart" ref={wrapperRef}>
			<svg ref={svgRef}>
			</svg>
		</div>
	)
}
