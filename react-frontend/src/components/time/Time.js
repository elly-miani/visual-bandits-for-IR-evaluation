import React, { useEffect, useState, useCallback } from 'react'
import fetchAPI from '../../core/helper/fetchAPI.js'

export default function Time() {
	console.log("➡️ Rendering Time()");

	let url = '/api/time';
	const [currentTime, setCurrentTime] = useState(0);
	console.log("📬 Time at render is", currentTime);

	function updateTime() {
		fetchAPI(url, res => {
			setCurrentTime(res.time);
		});
	}

	useEffect(() => {
		updateTime();
		console.log("📬 Initial render");
	}, []);

	const onButtonClick = useCallback(event => {
		updateTime();
	}, []);


	return (
		<div>
			<p>
				The current time is {currentTime}
				</p>
			<button onClick={onButtonClick}>
				Update time
			</button>
		</div>
	)
}
