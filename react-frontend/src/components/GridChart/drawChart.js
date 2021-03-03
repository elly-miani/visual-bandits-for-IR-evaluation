import * as d3 from 'd3'; 
import printLog from '../../core/helper/printLog';


export default function drawChart(gridState, runSize, svgRef, dimensions, printLogHelper) {
	// printLog("FUNCTION_CALL", "drawGridData()", null, printLogHelper);

	const grid = d3.select(svgRef);
	var svgHeight = null;
	var squareSize = null;

	// scales
	const xScale = d3.scaleBand()
		.domain(gridState.gridData[1].map((d,i) => i))
		.range([0, dimensions.width])
		.padding(0.1);
	
	const yScale = d3.scaleBand()
		.domain(gridState.gridData.map((d, i) => i))
		.range([0, dimensions.height])
		.padding(0.1);
	
	const colorScaleRetrieved = d3.scaleLinear()
		.domain([0, 1, 2])
		.range(["#FFAA33", "#2EC4B6", "#F49090"])
		.clamp(true);
	
	const colorScale = d3.scaleLinear()
		.domain([0, 1, 2])
		.range(["#FFDCAD", "#8BE4DE", "#F9C8C8"])
		.clamp(true);

	var row = grid.selectAll(".row")
		.data(gridState.gridData.slice(0, runSize))
		.join("g")
		.attr("class", "row");

	// var column = 
	row.selectAll(".square")
		.data(function (d) { return d; })
		.join("rect")
		.attr("class", "square")
		.on("click", function (event, d) {
			alert("DOC: " + d.document + "\n\nRUN: " + d.run + "\n\nRELEVANCY: " + d.relevancy + "\n\nSCORE: " + d.score + "\n\nTOPIC: " + d.topic + "\n\nRETRIEVED: " + d.retrieved);
			printLog("PRINT", "onClick()", d, printLogHelper);
		})
		.style("stroke", "#F2F4F8")
		.attr("width", xScale.bandwidth())
		.attr("height", () => {
			if (xScale.bandwidth() > 50) {
				squareSize = 50;
				return squareSize + "px";
			}
			else{
				squareSize = xScale.bandwidth();
				return squareSize;
			}
		})
		.attr("x", (d, i) => xScale(i))
		.attr("y", (d, i) => {
			if (xScale.bandwidth() > 50) {
				return 1 + 10 + (50 + 10) * d.array_row;
			}
			else {
				svgHeight = xScale(d.array_row % 10) - xScale(0)*10 + xScale(Math.floor(d.array_row / 10))*10;
				return svgHeight;
			}
		})
		.style("fill", function (d) {
			if(d.retrieved === 1) {
				return colorScaleRetrieved(d.relevancy);
			}
			if(d.retrieved === 2) {
				return colorScale(d.relevancy);
			}
			if(d.document === null) {
				return "#F2F4F8"
			}
			return "#DDEAFD";
		})
		.on("mouseenter", (event, d) => {
			grid
				.selectAll(".tooltip")
				.data([d])
				.join(enter => enter.append("text"))
				.attr("class", "tooltip")
				.text(d.run)
				.attr("x", (d) => xScale(d.array_column) + xScale.bandwidth() / 2)
				.attr("y", (d) => -10)
				.transition()
				.attr("text-anchor", "middle")
				.attr("opacity", 1);
		})
		.on("mouseleave", () => {
			grid.select(".tooltip").attr("opacity", 0);
		});


	grid.attr("height", () => {
		if (xScale.bandwidth() > 50) {
			return runSize * (squareSize + 10) + "px"
		}
		else {
			return svgHeight + xScale.bandwidth() + "px";
		}
	});

	grid.attr("width", dimensions.width);
}