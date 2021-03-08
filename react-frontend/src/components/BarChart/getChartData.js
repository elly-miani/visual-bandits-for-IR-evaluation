// import printLog from '../../core/helper/printLog';

export default function getChartData(runRelevancies, state, printLogHelper) {
	let chartData;

	if (state.value.length === 0) {
		chartData = Object.entries(runRelevancies).map(d => {
			return {
				'RUN': d[0],
				'DOCS_RETRIEVED': d[1].DOCS_RETRIEVED
			};
		})
	}
	if (state.value.length === 1) {
		chartData = Object.entries(runRelevancies).map(d => {
			return {
				'RUN': d[0],
				'REL': d[1].REL,
				'NON_REL': d[1].NON_REL
			};
		})
	}
	if (state.value.length === 2) {
		chartData = Object.entries(runRelevancies).map(d => {
			return {
				'RUN': d[0],
				'REL_UNIQUE': d[1].REL_UNIQUE,
				'REL_NON_UNIQUE': d[1].REL - d[1].REL_UNIQUE,
				'NON_REL': d[1].NON_REL
			};
		})
	}

	return chartData;
} 