import React from 'react'

import './Controls.css';

import UploadDataButton from './UploadData/UploadDataButton';
import ComputeAdjudicationButton from './ComputeAdjudication/ComputeAdjudicationButton';
import PoolSizePicker from './ComputeAdjudication/PoolSizePicker';
import AdjudicationMethodPicker from './ComputeAdjudication/AdjudicationMethodPicker';
import RunSizePicker from './RunSizePicker';
import TopicPicker from './TopicPicker';

export default function Controls(props) {

	return (
		<div className="controls-container inset">
			<div className="controls">

				<div>
					<UploadDataButton 
						fetchData={props.fetchData} 
						updateParameter={props.updateParameter}
					/>
				</div>
				
				<div>
					<span className="toggle-label">Topic</span>
					<TopicPicker 
						dataParameters={props.dataParameters} 
						updateParameter={props.updateParameter}
					/>
				</div>

				<div>
					<span className="toggle-label">Run Size</span>
					<div className="inline-input-group">
					<RunSizePicker 
						updateParameter={props.updateParameter}
					/>
					</div>
				</div>


				<div>
					<span className="toggle-label">Strategy</span>
					<AdjudicationMethodPicker 
						updateParameter={props.updateParameter}
					/>
				</div>

				<div>
					<span className="toggle-label">Pool Size</span>
					<div className="inline-input-group">
						<PoolSizePicker 
							updateParameter={props.updateParameter}
						/>
					</div>
				</div>

				<div>
					<ComputeAdjudicationButton 
						statusAdjudication={props.status.adjudication} 
						computeAdjudication={props.computeAdjudication} 
					/>
				</div>

			</div>
		</div>
		);
}
