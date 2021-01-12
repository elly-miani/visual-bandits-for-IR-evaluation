import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'; 

import printLog from '../../core/helper/printLog.js';
import useResizeObserver from '../../core/hooks/useResizeObserver.js';

import './GridChart.css';

function gridDataFunction(numColumn, numRow) {
	var data = new Array();
	var click = 0;

	// iterate for rows	
	for (var row = 0; row < numRow; row++) {
		data.push(new Array());

		// iterate for cells/columns inside rows
		for (var column = 0; column < numColumn; column++) {
			data[row].push({
				row: row,
				column: column,
				click: click
			})
		}
	}
	return data;
}

export default function GridChart() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const renderCount = useRef(1);
	const verbosity = 5;

	useEffect(() => {
		renderCount.current = renderCount.current + 1;
		printLog("RENDER", null, null, "GridChart()", renderCount.current, verbosity);
	})
	// == == == == == == == == == == == == == == == == == == == //

	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);
	var columns = 15;
	var rows = 10;

	const [gridData, setGridData] = useState(gridDataFunction(columns, rows));

	useEffect(() => {
		printLog("FUNCTION_CALL", "useEffect()", gridData, "GridChart()", renderCount.current, verbosity);

		// if (!dimensions) return;
		const grid = d3.select(svgRef.current);
		grid.attr("height", rows * (50+10) + 10 + "px");
		grid.attr("width", columns * (50+10) + 10 + "px");
		
		// var gridData = gridDataFunction();

		const colorScale = d3.scaleLinear()
			.domain([0, 1, 2, 3, 4])
			.range(["#DDEAFD", "#02DFF4", "#28EADD", "#5DF1BD", "#94F5A6"])
			.clamp(true);

		var row = grid.selectAll(".row")
			.data(gridData)
			.join("g")
			.attr("class", "row");

		var column = row.selectAll(".square")
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
			// .attr("stroke-width", function (d) { return 5; })
			.on("click", function (event, d) {
				// printLog("PRINT", "Click data: ", d, "GridChart()", renderCount.current, verbosity);
				// printLog("PRINT", "Click event: ", event, "GridChart()", renderCount.current, verbosity);
				console.log("indexes = [", d.row, ",", d.column, "]");
				// 1. Make a shallow copy of the items
				let temp_gridData = [...gridData];
				// console.log("temp_gridData: ", temp_gridData);
				// 2. Make a shallow copy of the item you want to mutate
				let temp_cell = { ...temp_gridData[d.row][d.column] };
				// console.log("temp_cell: ", temp_cell);
				// 3. Replace the property you're intested in
				temp_cell.click = temp_cell.click + 1;
				// console.log("temp_cell.click: ", temp_cell.click);
				// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
				temp_gridData[d.row][d.column] = temp_cell;
				// console.log("temp_gridData[0][0]: ", temp_gridData[0][0]);
				// 5. Set the state to our new copy
				setGridData( temp_gridData );
				// console.log("gridData: ", gridData);
			});
	}, [gridData]);

	return (
		<div id="wrapper--GridChart" ref={wrapperRef}>
			<svg ref={svgRef}>
			</svg>
		</div>
	)
}
