import * as d3 from 'd3';
import printLog from '../../core/helper/printLog';

export default function drawChart(chartData, runRelevanciesLast, svgRef, dimensions, printLogHelper) {

	const svg = d3.select(svgRef)

	// identify how many runs there are and their names
	var runNames = []
	for (let key in runRelevanciesLast) {
		runNames.push(key);
	}

	const stackGenerator = d3.stack().keys(["REL_NON_UNIQUE", "REL_UNIQUE", "NON_REL"]);
	const layers = stackGenerator(chartData)

	// scales
	const xScale = d3.scaleBand()
		.domain(runNames)
		.range([0, dimensions.width])
		.padding(0.2);

	const extent = [0, d3.max(layers, layer => d3.max(layer, sequence => sequence[1]))]
	const yScale = d3.scaleLinear()
		.domain(extent)
		.range([dimensions.height, 0]);

	const colorScale = d3.scaleOrdinal()
		.domain(["REL_NON_UNIQUE", "REL_UNIQUE", "NON_REL"])
		.range(["#9EF3D9", "#94F5A6", "#FFC2D3"]);

	// axis
	// const xAxis = d3.axisBottom(xScale) 		//.ticks(data.length).tickFormat(i => i+1);
	// svg.select(".x-axis").style("transform", `translateY(${dimensions.height}px)`).call(xAxis);

	const yAxis = d3.axisLeft(yScale);
	svg.select(".y-axis").call(yAxis);

	svg.attr("width", dimensions.width);

	// rendering
	svg
		.selectAll(".layer")
		.data(layers)
		.join("g")
		.attr("class", "layer")
		.attr("fill", layer => colorScale(layer.key))
		.selectAll("rect")
		.data(layer => layer)
		.join("rect")
		.attr("x", sequence => {
			return xScale(sequence.data.RUN)
		})
		.attr("width", xScale.bandwidth())
		.attr("y", sequence => yScale(sequence[1]))
		.attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]))
		.on("mouseenter", (event, d) => {
			svg
				.selectAll(".tooltip")
				.data([d])
				.join(enter => enter.append("text").attr("y", dimensions.height+20))
				.attr("class", "tooltip")
				.text(d.data.RUN)
				.attr("x", sequence => {
					return xScale(sequence.data.RUN) + xScale.bandwidth() / 2;
				})
				.transition()
				.attr("text-anchor", "middle")
				.attr("opacity", 1);
		})
		.on("mouseleave", () => {
			svg.select(".tooltip").attr("opacity", 0);
		});
}