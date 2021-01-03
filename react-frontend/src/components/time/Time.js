import React, { useEffect, useState, useCallback, useRef } from 'react'
import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

export default function Time() {
	const renderCount = useRef(1);
	const verbosity = 1;

	useEffect(() => {
		renderCount.current = renderCount.current +1;
		printLog("RENDER", null, null, "Time()", renderCount.current, verbosity);
	})

	let url = '/api/time';
	const [currentTime, setCurrentTime] = useState(0);
	printLog("PRINT", "Time at render is", currentTime, "Time()", renderCount.current, verbosity);

	const updateTime = useCallback( () => {
		printLog("FUNCTION_CALL", "Calling updateTime()", currentTime, "Time()", renderCount.current, verbosity);
		fetchAPI(url, res => {
			printLog("PRINT", "Time at updateTime() before setting state", currentTime, "Time()", renderCount.current, verbosity);
			setCurrentTime(res.time);
			printLog("PRINT", "Time at updateTime() after setting state", currentTime, "Time()", renderCount.current, verbosity);
		});
	}, [url]);

	useEffect(() => {
		printLog("FUNCTION_CALL", "Calling useEffect()", currentTime, "Time()", renderCount.current, verbosity);
		updateTime();
	}, [updateTime]);

	const onButtonClick = () => {
		printLog("FUNCTION_CALL", "Clicking button", currentTime, "Time()", renderCount.current, verbosity);
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
