import * as d3 from 'd3'; 

export default function drawChart(gridState, setGridState, svgRef, dimensions, state, printLogHelper) {
	// printLog("FUNCTION_CALL", "drawGridData()", null, printLogHelper);

	const grid = d3.select(svgRef);
	console.log(dimensions);

	// scales
	const xScale = d3.scaleBand()
		.domain(gridState.gridData[1].map((d,i) => i))
		.range([0, dimensions.width])
		.padding(0.1);
	
	const colorScale = d3.scaleLinear()
		.domain([0, 1, 2])
		.range(["#FFA0B8", "#5DF1BD", "#DDEAFD"])
		.clamp(true);


	grid.attr("height", function (d) {
		if (xScale.bandwidth() > 50) {
			return gridState.totRanks * (50 + 10) + 10 + "px";
		}
		else {
			return gridState.totRanks * (xScale.bandwidth() + 10) + 10 + "px"
		}
	});
	grid.attr("width", gridState.totRuns * (xScale.bandwidth() + 10) + 10 + "px");

	var row = grid.selectAll(".row")
		.data(gridState.gridData)
		.join("g")
		.attr("class", "row");

	// var column = 
	row.selectAll(".square")
		.data(function (d) { return d; })
		.join("rect")
		.attr("class", "square")
		// .on("click", function (event, d) {
		// 	// printLog("PRINT", "Click data: ", d, printLogHelper.current);
		// 	// printLog("PRINT", "Click event: ", event, printLogHelper.current);

		// 	// 1. Make a shallow copy of the items
		// 	let temp_gridData = [...gridState.gridData];
		// 	// 2. Make a shallow copy of the item you want to mutate
		// 	let temp_cell = { ...temp_gridData[d.row][d.column] };
		// 	// 3. Replace the property you're intested in
		// 	temp_cell.click = temp_cell.click + 1;
		// 	// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
		// 	temp_gridData[d.row][d.column] = temp_cell;
		// 	// 5. Set the state to our new copy
		// 	setGridState(prevState => {
		// 		return { ...prevState, gridData: temp_gridData }
		// 	});

		// })
		.on("click", function (event, d) {
			alert("DOC: " + d.document + "\n\nRUN: " + d.run + "\n\nRELEVANCY: " + d.relevancy + "\n\nSCORE: " + d.score + "\n\nTOPIC: " + d.topic);
		})
		// tooltip on hover
		// .on("mouseenter", (event, d) => {
		// 	// printLog("PRINT", "on mousenter, d: ", d.document, printLogHelper.current);
		// 	grid
		// 		.selectAll(".doc-info")
		// 		.data([d])
		// 		.join(enter => enter.append("text").attr("y", 0))
		// 		.attr("class", "tooltip")
		// 		.text("DOC: " + d.document + "  RUN: " + d.run + "  RELEVANCY: " + d.relevancy + "  SCORE: " + d.score + "  TOPIC: " + d.topic)
		// 		.attr("x", "200px")
		// 		.transition()
		// 		.attr("y", 0)
		// 		.attr("text-anchor", "middle")
		// 		.attr("opacity", 1);
		// })
		// .on("mouseleave", () => {
		// 	grid.select(".tooltip").remove();
		// })
		.style("stroke", "#F2F4F8")
		.attr("x", (d, i) => xScale(i))
		.attr("y", function (d) { 
			if (xScale.bandwidth() > 50) {
				return 1 + 10 + (50 + 10) * d.row;
			}
			else {
				return 1 + 10 + (xScale.bandwidth() + 10) * d.row;
			}
		})
		.attr("width", xScale.bandwidth())
		.attr("height", () => {
			if (xScale.bandwidth() > 50) {
				return "50px";
			}
			else{
				return xScale.bandwidth();
			}
		})
		.style("fill", function (d) {
			if (state.showQrels) {
				return colorScale(d.relevancy);
			}
			return "#DDEAFD";
		});
}