import printLog from "../../core/helper/printLog";

export default function createGridData(runs, qrels, printLogHelper) {
	var gridData = [];
	var click = 0;

	// identify the max rank value in the runs
	var totRanks = 0;
	for (let key in runs) {
		totRanks++;
	}

	// identify how many runs there are and their names
	var run_names = []
	for (let key in runs[1]) {
		run_names.push(key);
	}
	var totRuns = run_names.length;
	// printLog("PRINT", "run_names: ", run_names, printLogHelper);

	// iterate for each rank (row in the grid)	
	for (var rank = 0; rank < totRanks; rank++) {
		gridData.push([]);
		var rank_data = runs[rank + 1];									// +1 b/c the ranks start from 1

		// iterate for each run (cell inside row)
		for (var run = 0; run < totRuns; run++) {
			var document_data = rank_data[run_names[run]];

			var curr_relevancy = 2; // default: not evaluated
			if (qrels[document_data.DOCUMENT] != null)
				curr_relevancy = qrels[document_data.DOCUMENT].RELEVANCY;

			// var curr_relevancy = (() => {
			// 	if (qrels[document_data.DOCUMENT] != null)
			// 		return qrels[document_data.DOCUMENT].RELEVANCY;
			// 	return 2; // default: not evaluated
			// })();

			if (!document_data) {
				gridData[rank].push({
					row: rank,
					column: run,
					document: null,
					run: run_names[run],
					score: null,
					topic: null,
					query: null,
					relevancy: curr_relevancy,
					click: click
				})
			}
			else {
				gridData[rank].push({
					row: rank,
					column: run,
					document: document_data.DOCUMENT,
					run : run_names[run],
					score: document_data.SCORE,
					topic: document_data.TOPIC,
					query: document_data.QUERY,
					relevancy: curr_relevancy,
					click: click
				})
			}
		}
	}
	return {
		gridData: gridData,
		totRanks: totRanks,
		totRuns: totRuns
	};
}