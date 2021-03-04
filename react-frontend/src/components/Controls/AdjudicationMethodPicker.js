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
					"label": "x",
					"value": "x"
				}
			]}
			placeholder="Round Robin"
			defaultValue="round_robin"
			style={{ width: 150 }}
			size="sm"
			onChange={(value, event) => {
				props.updateParameter(value, 'adjudication-method')
			}}
		/>
	);
}