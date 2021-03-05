import React from 'react'

import { SelectPicker } from 'rsuite';

export default function TopicPicker(props) {
	let topicsList = props.datasetParam.topicsList.map(x => ({ label: x, value: x }));

	if (topicsList.length !== 0) {
		return (
			<SelectPicker
				data={topicsList}
				placeholder={"Default: " + topicsList[0].value}
				defaultValue={topicsList[0]}
				style={{ width: 150 }}
				size="m"
				onChange={(value, event) => {
					props.updateParameter(value, 'topic')
				}}
			/>
		);
	}
	else {
		return (
			<SelectPicker
				data={[]}
				placeholder={"Loading topics..."}
				defaultValue={[]}
				style={{ width: 150 }}
				size="m"
			/>
		);
	}

}
