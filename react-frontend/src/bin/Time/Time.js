import React, { useEffect, useState, useCallback, useRef, Fragment } from 'react'
import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

export default function Time() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "Time()",
		verbosity: [1, 1, 0, 0, 0],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //
	let url = '/api/time';
	const [currentTime, setCurrentTime] = useState(0);
	printLog("PRINT", "Time at render is", currentTime, printLogHelper.current);

	const updateTime = useCallback( () => {
		printLog("FUNCTION_CALL", "Calling updateTime()", currentTime, printLogHelper.current);
		fetchAPI(printLogHelper.current, url, res => {
			printLog("PRINT", "Time at updateTime() before setting state", currentTime, printLogHelper.current);
			setCurrentTime(res.time);
			printLog("PRINT", "Time at updateTime() after setting state", currentTime, printLogHelper.current);
		});
	}, [url]);

	useEffect(() => {
		printLog("FUNCTION_CALL", "Calling useEffect()", currentTime, printLogHelper.current);
		updateTime();
	}, [updateTime]);

	const onButtonClick = () => {
		printLog("FUNCTION_CALL", "Clicking button", currentTime, printLogHelper.current);
		updateTime();
	};


	return (
		<Fragment>
			<p>
				The current time is {currentTime}
			</p>
			<button onClick={onButtonClick}>
				Update time
			</button>
		</Fragment>
	)
}
