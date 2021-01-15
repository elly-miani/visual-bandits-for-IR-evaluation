import * as d3 from 'd3'; 

export default function drawChart(gridState, setGridState, svgRef, printLogHelper) {
	// printLog("FUNCTION_CALL", "drawGridData()", null, printLogHelper);

	// if (!dimensions) return;
	const grid = d3.select(svgRef);
	grid.attr("height", gridState.totRanks * (50 + 10) + 10 + "px");
	grid.attr("width", gridState.totRuns * (50 + 10) + 10 + "px");

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
			setGridState(prevState => {
				return { ...prevState, gridData: temp_gridData }
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
}