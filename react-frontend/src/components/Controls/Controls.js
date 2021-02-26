import React from 'react'

import StartAdjudicationButton from './StartAdjudicationButton';
import PoolSizePicker from './PoolSizePicker';
import AdjudicationMethodPicker from './AdjudicationMethodPicker';
import RunSizePicker from './RunSizePicker';
import TopicPicker from './TopicPicker';

export default function Controls(props) {

	// props.status
	// props.computeAdjudication
	// props.updateParameter

	return (
			<div className="controls-container inset">
				<div className="controls">

					<div>
						<span className="toggle-label">Topic</span>
						<TopicPicker updateParameter={props.updateParameter}/>
					</div>

					<div>
						<span className="toggle-label">Run Size</span>
						<div className="inline-input-group">
						<RunSizePicker updateParameter={props.updateParameter}/>
						</div>
					</div>


					<div>
						<span className="toggle-label">Strategy</span>
						<AdjudicationMethodPicker updateParameter={props.updateParameter}/>
					</div>

					<div>
						<span className="toggle-label">Pool Size</span>
						<div className="inline-input-group">
							<PoolSizePicker updateParameter={props.updateParameter}/>
						</div>
					</div>

					<StartAdjudicationButton status={props.status} handleClick={props.computeAdjudication}/>

				</div>
			</div>
		);
}
