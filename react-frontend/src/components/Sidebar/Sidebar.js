import React from 'react';

import './Sidebar.css';
import AdjudicationAutoplayControls from './AdjudicationAutoplayControls';


export default function Sidebar(props) {

	return (
		<div className="inset">
			<div className="controls">

				<AdjudicationAutoplayControls 
					updateAdjudicationAutoplay={props.updateAdjudicationAutoplay}
					adjudicationAutoplay={props.adjudicationAutoplay}
					poolSize={props.poolSize}
					disable={props.retrievedDocs === null}
				/>

				<div id="retrieved-document">
					<p>
						Documents retrieved: <strong>{ props.retrievedDocs ? props.adjudicationAutoplay.status+1 : 0}</strong>
					</p>
					<p>
						Relevant documents: <strong>boh</strong>
					</p>
				</div>

			</div>
		</div>
	);
}
