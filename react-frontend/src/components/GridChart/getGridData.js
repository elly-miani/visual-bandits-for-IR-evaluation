// import printLog from "../../core/helper/printLog";

export default function getGridData(runs, qrels, runsList, printLogHelper) {
	var gridData = [];

	// iterate for each rank (row in the grid)	
	for (var rank in runs) {
		
		gridData.push([]);
		var rank_data = runs[rank];									// +1 b/c the ranks start from 1

		// iterate for each run (cell inside row)
		for (var run = 0; run < runsList.length; run++) {
			var document_data = rank_data[runsList[run]];

			if (!document_data) {
				gridData[rank-1].push({
					array_row: rank-1,
					array_column: run,
					document: null,
					rank: null,
					run: runsList[run],
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
					run: runsList[run],
					score: document_data.SCORE,
					topic: document_data.TOPIC,
					query: document_data.QUERY,
					relevancy: curr_relevancy,
					retrieved: 0
				})
			}
		}
	}
	return gridData;
}