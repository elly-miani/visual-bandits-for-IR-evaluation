import React from 'react'

import { SelectPicker } from 'rsuite';

export default function AdjudicationMethodPicker(props) {

	return (
		<SelectPicker
			data={[
				{
					"label": "Round Robin",
					"value": "round_robin"
				},
				{
					"label": "Max Mean",
					"value": "max_mean"
				}
			]}
			placeholder="Round Robin"
			defaultValue="round_robin"
			style={{ width: 150 }}
			size="m"
			onChange={(value, event) => {
				props.updateParameter(value, 'adjudication-method')
			}}
		/>
	);
}
