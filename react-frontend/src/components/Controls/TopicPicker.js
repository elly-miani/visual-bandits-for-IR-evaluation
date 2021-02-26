import React from 'react'

import { SelectPicker } from 'rsuite';

export default function TopicPicker(props) {

	return (
		<SelectPicker
			data={[
				{
					"label": "401",
					"value": 401
				},
				{
					"label": "402",
					"value": 402
				},
				{
					"label": "403",
					"value": 403
				},
				{
					"label": "404",
					"value": 404
				},
				{
					"label": "405",
					"value": 405
				},
				{
					"label": "406",
					"value": 406
				},
				{
					"label": "407",
					"value": 407
				}
			]}
			placeholder="Default: 401"
			defaultValue="401"
			style={{ width: 150 }}
			size="sm"
			onChange={(value, event) => {
				props.updateParameter(value, 'topic')
			}}
		/>
	);
}
