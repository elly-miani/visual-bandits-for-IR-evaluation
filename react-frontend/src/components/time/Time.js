import React from 'react'
import useFetch from '../../core/hooks/useFetch.js'

export default function Time() {
	console.log("➡️ Rendering Time()");

	let url = '/api/time';
	const res = useFetch(url, {} );

	console.log("📬 Response for", url, "is", res);

	if (!res.response) {
		return <div>loading...</div>
	}

	const fetchedTime = res.response.time;

	function updateTime() {
		return;
	}

	return (
		<div>
			<p>
				The current time is {fetchedTime}.
				</p>
			<button onClick={updateTime}>
				Update time
			</button>
		</div>
	)
}
