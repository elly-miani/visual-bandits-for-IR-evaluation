import printLog from "../../core/helper/printLog";

export default function getGridData(runs, qrels, printLogHelper) {
	var gridData = [];

	// identify the max rank value in the data
	var maxRank = 0;
	for (let key in runs) {
		maxRank++;
	}
	
	// identify how many runs there are and their names
	var runNames = []
	for (let key in runs[1]) {
		runNames.push(key);
	}
	var runsNumber = runNames.length;
	// printLog("PRINT", "runNames: ", runNames, printLogHelper);

	// iterate for each rank (row in the grid)	
	for (var rank = 1; rank <= maxRank; rank++) {
		gridData.push([]);
		var rank_data = runs[rank];									// +1 b/c the ranks start from 1

		// iterate for each run (cell inside row)
		for (var run = 0; run < runsNumber; run++) {
			var document_data = rank_data[runNames[run]];

			if (!document_data) {
				gridData[rank-1].push({
					array_row: rank-1,
					array_column: run,
					document: null,
					rank: null,
					run: runNames[run],
					score: null,
					topic: null,
					query: null,
					relevancy: 2,
					retrieved: 0
				})
			}
			else {
				var curr_relevancy = 2; // default: not evaluated
				if (qrels[document_data.DOCUMENT] != null) {
					curr_relevancy = qrels[document_data.DOCUMENT].RELEVANCY;
				}

				gridData[rank-1].push({
					array_row: rank-1,
					array_column: run,
					document: document_data.DOCUMENT,
					rank: rank,
					run : runNames[run],
					score: document_data.SCORE,
					topic: document_data.TOPIC,
					query: document_data.QUERY,
					relevancy: curr_relevancy,
					retrieved: 0
				})
			}
		}
	}
	return {
		gridData: gridData,
		runSize: maxRank,
		runsNumber: runsNumber,
		runNames: runNames
	};
}