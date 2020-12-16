import React, { useEffect, useState } from 'react'
// import useFetch from '../../core/hooks/useFetch.js'
import fetchAPI from '../../core/helper/fetchAPI.js'

export default function Time() {
	console.log("➡️ Rendering Time()");

	let url = '/api/time';
	const [currentTime, setCurrentTime] = useState(0)

	useEffect(() => {
		fetchAPI(url, res => {
			setCurrentTime(res.time);
			});

		console.log("📬 Initial render", currentTime);
	}, [])
	
	console.log("📬 Time at render is", currentTime);
	
	function updateTime() {
		fetchAPI(url, res => {
			setCurrentTime(res.time);
		});
		console.log("📬 Updated time: ", currentTime);
	}

	return (
		<div>
			<p>
				The current time is {currentTime}.
				</p>
			<button onClick={updateTime}>
				Update time
			</button>
		</div>
	)
}
