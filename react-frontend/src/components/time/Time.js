import React, { useEffect, useState, useCallback } from 'react'
import fetchAPI from '../../core/helper/fetchAPI.js'

export default function Time() {
	console.log("➡️ Rendering Time()");

	let url = '/api/time';
	const [currentTime, setCurrentTime] = useState(0);
	console.log("📗 Time at render is", currentTime);

	const updateTime = useCallback( () => {
		fetchAPI(url, res => {
			setCurrentTime(res.time);
		});
	}, [url]);

	useEffect(() => {
		updateTime();
	}, [updateTime]);

	// const onButtonClick = useCallback(event => {
	// 	updateTime();
	// }, [updateTime]);

	const onButtonClick = () => {
		updateTime();
	};


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
