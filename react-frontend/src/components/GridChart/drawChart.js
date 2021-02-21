import * as d3 from 'd3'; 
import printLog from '../../core/helper/printLog';

export default function drawChart(gridState, setGridState, runSize, svgRef, dimensions, state, printLogHelper) {
	// printLog("FUNCTION_CALL", "drawGridData()", null, printLogHelper);

	const grid = d3.select(svgRef);
	var svgHeight = null;
	var squareSize = null;

	// scales
	const xScale = d3.scaleBand()
		.domain(gridState.gridData[1].map((d,i) => i))
		.range([0, dimensions.width])
		.padding(0.1);
	
	const colorScaleRetrieved = d3.scaleLinear()
		.domain([0, 1, 2])
		.range(["#FFA0B8", "#5DF1BD", "#78ADFD"])
		.clamp(true);
	
	const colorScale = d3.scaleLinear()
		.domain([0, 1, 2])
		.range(["#FFC5D3", "#B1F1DA", "#A9CAFD"])
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
				svgHeight = xScale(d.array_row);
				return xScale(d.array_row);
			}
		})
		.style("fill", function (d) {
			if (state.showQrels) {
				if(d.retrieved == 1) {
					return colorScaleRetrieved(d.relevancy);
				}
				if(d.retrieved == 2) {
					return colorScale(d.relevancy);
				}
			}
			return "#DDEAFD";
		});


	grid.attr("height", () => {
		if (xScale.bandwidth() > 50) {
			return gridState.runSize * (squareSize + 10) + "px"
		}
		else {
			return svgHeight + xScale.bandwidth() + "px";
		}
	});

	grid.attr("width", dimensions.width);
}