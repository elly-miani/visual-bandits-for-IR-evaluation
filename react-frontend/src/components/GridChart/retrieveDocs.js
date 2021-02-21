import printLog from "../../core/helper/printLog";

export default function retrieveDocs(gridState, setGridState, retrievedDocs, printLogHelper) {
	printLog("FUNCTION_CALL", "retrieveDocs()", null, printLogHelper);

	let i = 0
	for (let index in retrievedDocs) {
		// i++
		// if (i > 1) { break; }
		// console.log("RETRIEVED FOR REAL:", retrievedDocs[index])
		let retrievedRunName = retrievedDocs[index].RETRIEVED_FROM;
		let retrievedRunIndex = gridState.runNames.indexOf(retrievedRunName);
		let retrievedRank = retrievedDocs[index].RANK;
		// console.log(retrievedRank)

		if (gridState.gridData[retrievedRank+1] != null) {		

			// 1. Make a shallow copy of the items
			let copy_gridData = [...gridState.gridData];

			for (let occurrencesRank in retrievedDocs[index].OCCURRENCES) {				
				for (let occurrencesIndex in retrievedDocs[index].OCCURRENCES[occurrencesRank]) {
					let occurrencesRunName = retrievedDocs[index].OCCURRENCES[occurrencesRank][occurrencesIndex];
					let occurrencesRunIndex = gridState.runNames.indexOf(occurrencesRunName);

					if (gridState.gridData[occurrencesRank-1] != null) {
						// 2. Make a shallow copy of the item you want to mutate
						let copy_doc = { ...copy_gridData[occurrencesRank-1][occurrencesRunIndex] };

						// 3. Replace the property you're interested in
						copy_doc.retrieved = 2;

						// 4. Put it back into our array
						copy_gridData[occurrencesRank-1][occurrencesRunIndex] = copy_doc;
						// console.log("UPDATED:", copy_doc)
					}
				}
			}

			// 2. Make a shallow copy of the item you want to mutate
			let copy_doc = { ...copy_gridData[retrievedRank - 1][retrievedRunIndex] };

			// 3. Replace the property you're interested in
			copy_doc.retrieved = 1;

			// 4. Put it back into our array
			copy_gridData[retrievedRank - 1][retrievedRunIndex] = copy_doc;
			// console.log("RETRIEVED:", copy_doc)

			
			// 5. Set the state to our new copy
			setGridState(prevState => {
				return { ...prevState, gridData: copy_gridData }
			});

			// printLog("PRINT", "AFTER:", gridState.gridData[rank][retrievedRunIndex], printLogHelper);
		}
	


	}
}