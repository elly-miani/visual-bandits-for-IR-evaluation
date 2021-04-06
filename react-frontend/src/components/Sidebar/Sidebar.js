import React, { useState, useEffect } from 'react';

import './Sidebar.css';

import AdjudicationAutoplayControls from './AdjudicationAutoplayControls';
import AdjudicationStats from './AdjudicationStats'
import RetrievedDocs from './RetrievedDocs';


export default function Sidebar(props) {
	const [stats, setStats] = useState(null);

	const getStats = (status, runRelevancies) => {
		if (!runRelevancies) return null;

		var relDocs = 0;
		var nonRelDocs = 0;
		var relUniqueDocs = 0;

		for (let run in runRelevancies[status]) {
			relDocs += runRelevancies[status][run]['REL'];
			nonRelDocs += runRelevancies[status][run]['NON_REL'];
			relUniqueDocs = + runRelevancies[status][run]['REL_UNIQUE'];
		}
		return { relDocs, nonRelDocs, relUniqueDocs };
	}



	useEffect(() => {
		setStats(getStats(props.adjudicationAutoplay.status, props.runRelevancies));
	}, [props.adjudicationAutoplay.status, props.runRelevancies])


	return (
		<div className="inset">
			<div className="controls">

				<AdjudicationAutoplayControls 
					updateAdjudicationAutoplay={props.updateAdjudicationAutoplay}
					adjudicationAutoplay={props.adjudicationAutoplay}
					poolSize={props.retrievedDocs !== null ? props.retrievedDocs.length : 0}
					disable={props.retrievedDocs === null}
				/>

				<AdjudicationStats 
					adjudicationStatus={props.adjudicationAutoplay.status}
					retrievedDocs={props.retrievedDocs}
					runRelevancies={props.runRelevancies}
					stats={stats}
				/>

				<RetrievedDocs 
					adjudicationStatus={props.adjudicationAutoplay.status}
					retrievedDocs={props.retrievedDocs}
				/>

			</div>
		</div>
	);
}
