import React from 'react'

import './Controls.css';

import UploadDataButton from './UploadDataButton';
import StartAdjudicationButton from './StartAdjudicationButton';
import PoolSizePicker from './PoolSizePicker';
import AdjudicationMethodPicker from './AdjudicationMethodPicker';
import RunSizePicker from './RunSizePicker';
import TopicPicker from './TopicPicker';

export default function Controls(props) {


	return (
			<div className="controls-container inset">
				<div className="controls">

					<div>
					<UploadDataButton status={props.status} fetchData={props.fetchData} updateParameter={props.updateParameter}/>
					</div>
					
					<div>
						<span className="toggle-label">Topic</span>
						<TopicPicker datasetParam={props.datasetParam} updateParameter={props.updateParameter}/>
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

					<div>
						<StartAdjudicationButton status={props.status} handleClick={props.computeAdjudication} />
					</div>

				</div>
			</div>
		);
}
