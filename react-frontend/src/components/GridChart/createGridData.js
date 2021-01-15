export default function createGridData(data, printLogHelper) {
	var gridData = [];
	var click = 0;

	// identify the max rank value in the data
	var totRanks = 0;
	for (let key in data) {
		totRanks++;
	}

	// identify how many runs there are and their names
	var run_names = []
	for (let key in data[1]) {
		run_names.push(key);
	}
	var totRuns = run_names.length;

	// iterate for each rank (row in the grid)	
	for (var rank = 0; rank < totRanks; rank++) {
		gridData.push([]);
		var rank_data = data[rank + 1];									// +1 b/c the ranks start from 1

		// iterate for each run (cell inside row)
		for (var run = 0; run < totRuns; run++) {
			var document_data = rank_data[run_names[run]];

			if (!document_data) {
				gridData[rank].push({
					row: rank,
					column: run,
					document: null,
					query: null,
					score: null,
					topic: null,
					click: click
				})
			}
			else {
				gridData[rank].push({
					row: rank,
					column: run,
					document: document_data.DOCUMENT,
					query: document_data.QUERY,
					score: document_data.SCORE,
					topic: document_data.TOPIC,
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