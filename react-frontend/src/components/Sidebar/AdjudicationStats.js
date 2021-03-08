export default function AdjudicationStats(props) {

	if (props.runRelevancies !== null && props.stats !== null) {
		return (
			<div id="adjudication-stats">
				<p>
					Docs retrieved: <strong>{props.retrievedDocs ? props.adjudicationStatus + 1 : 0}</strong>
				</p>
				<p>
					Relevant: <strong>{props.stats.relDocs}</strong> 	
				</p>
				<p>
					Uniques: <strong>{props.stats.relUniqueDocs}</strong>
				</p>
				<p>
					Nonrelevant: <strong>{props.stats.nonRelDocs}</strong>
				</p>
			</div>
		);
	}
	else {
		return (
			<div id="adjudication-stats">
				<p>
					Documents retrieved: <strong>{props.retrievedDocs ? props.adjudicationStatus + 1 : 0}</strong>
				</p>
			</div>
		);
	}
	
}