import * as d3 from 'd3';
// import printLog from '../../core/helper/printLog';

export default function drawChart(chartData, runsList, svgRef, dimensions, printLogHelper) {

	const svg = d3.select(svgRef)

	const stackGenerator = d3.stack().keys(["DOCS_RETRIEVED", "REL", "REL_NON_UNIQUE", "REL_UNIQUE", "NON_REL"]);
	const layers = stackGenerator(chartData)

	// scales
	const xScale = d3.scaleBand()
		.domain(runsList)
		.range([0, dimensions.width])
		.padding(0.2);

	const extent = [0, d3.max(layers, layer => d3.max(layer, sequence => sequence[1]))]
	const yScale = d3.scaleLinear()
		.domain(extent)
		.range([dimensions.height, 0]);

	const colorScale = d3.scaleOrdinal()
		.domain(["DOCS_RETRIEVED", "REL", "REL_NON_UNIQUE", "REL_UNIQUE", "NON_REL"])
		.range(["#DDEAFD", "#2EC4B6", "#2EC4B6", "#8BE4DE", "#FFAA33"]);

	// axis
	// const xAxis = d3.axisBottom(xScale) 		//.ticks(data.length).tickFormat(i => i+1);
	// svg.select(".x-axis").style("transform", `translateY(${dimensions.height}px)`).call(xAxis);

	const yAxisTicks = yScale.ticks()
		.filter(tick => Number.isInteger(tick));
	const yAxis = d3.axisLeft(yScale)
		.tickValues(yAxisTicks)
		.tickFormat(d3.format('d'));

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