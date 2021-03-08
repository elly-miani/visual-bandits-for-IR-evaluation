import printLog from "../../core/helper/printLog";

export default function updateRetrievedDoc(gridState, retrievedDocs, runsList, printLogHelper) {
	printLog("FUNCTION_CALL", "updateRetrievedDocs()", null, printLogHelper);

	var cloneDeep = require('lodash.clonedeep');

	// make a shallow copy of gridState to be able to update it
	let updatedGridData = cloneDeep(gridState);

	// for (let index in retrievedDocs) {
		// for each document in retrievedDocs

		let retrievedRunName = retrievedDocs.RETRIEVED_FROM;
		let retrievedRunIndex = runsList.indexOf(retrievedRunName);
		let retrievedRank = retrievedDocs.RANK;

		if (updatedGridData[retrievedRank + 1] != null) {

			for (let occurrencesRank in retrievedDocs.OCCURRENCES) {
				// for each rank where there is at least a document occurrence

				for (let occurrencesIndex in retrievedDocs.OCCURRENCES[occurrencesRank]) {
					// for each document occurrence

					let occurrencesRunName = retrievedDocs.OCCURRENCES[occurrencesRank][occurrencesIndex];
					let occurrencesRunIndex = runsList.indexOf(occurrencesRunName);

					if (updatedGridData[occurrencesRank - 1] != null) {
						// update updateGridData by setting retrieved = 2 for each occurrence of the current document

						let updatedDoc = { ...updatedGridData[occurrencesRank - 1][occurrencesRunIndex] };
						updatedDoc.retrieved = 2;
						updatedDoc.retrievedFrom = retrievedRunName;
						updatedGridData[occurrencesRank - 1][occurrencesRunIndex] = updatedDoc;
					}
				}
			}

			// update updateGridData by setting retrieved = 1 for the current document, 
			// in the run where it is originally retrieved
			let updatedDoc = { ...updatedGridData[retrievedRank - 1][retrievedRunIndex] };
			updatedDoc.retrieved = 1;
			updatedGridData[retrievedRank - 1][retrievedRunIndex] = updatedDoc;
		}

	return updatedGridData;
}