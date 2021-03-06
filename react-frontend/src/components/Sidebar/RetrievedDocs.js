export default function RetrievedDocs(props) {

	const docColor = (relevancy) => {
		switch (relevancy) {
			case 0:
				return "#FFAA33";
			case 1:
				return "#2EC4B6";
			case 2:
				return "#F49090";
			default:
				break;
		}
	}

	if(props.retrievedDocs !== null) {
		return (
			<div id="retrieved-documents-list">
				{
					props.retrievedDocs
						.slice(props.adjudicationStatus >= 5 ? props.adjudicationStatus - 4 : 0, props.adjudicationStatus+1)
						.reverse()
						.map(function (d, idx) {
							return (
								<div id="retrieved-document" style={{ background: docColor(d.RELEVANCY)}}>
									<p>{d.DOCUMENT}</p>
									<p><span>Run:</span> {d.RETRIEVED_FROM} [{d.RANK}]  </p>
								</div>
							)
						})
				}
			</div>
		);
	}
	else {
		return <span></span>
	}
}