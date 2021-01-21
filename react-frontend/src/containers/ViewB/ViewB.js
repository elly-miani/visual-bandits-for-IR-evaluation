import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';

import './ViewB.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';

function ViewB() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "ViewB()",
		verbosity: [0, 1, 0, 0, 0],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //
	

	const [url, setUrl] = useState('/api/mockdata/GridChart')
	const [urlcontrol, setUrlControl] = useState(1);
	const [data, setData] = useState(null);
	printLog("PRINT", "Data at render is:", data, printLogHelper.current);


	useEffect(() => {
		fetchAPI(printLogHelper.current, url, res => {
			setData(res);
		});
	}, [url])

	
	const onButtonClick = () => {
		printLog("FUNCTION_CALL", "onButtonClick()", null, printLogHelper.current);
		printLog("PRINT", "urlcontrol =", urlcontrol, printLogHelper.current);

		if (urlcontrol) {
			setUrlControl(0);
			setUrl('/api/mockdata/GridChart2');
		}
		else {
			setUrlControl(1);
			setUrl('/api/mockdata/GridChart');
		}
	};


	if (!data) {
		return (
			<Fragment>
				<div id="container--viewB" className="offset">
					<div>Loading...</div>
				</div>
			</Fragment>
		)
	}
	else {
		return (
			<Fragment>
				<div id="container--viewB" className="offset">
					<GridChart data={data} />
					{/* {JSON.stringify(data, null, 2)} */}
					<br />
					<div className="controls">
						<button className="button--3d button--accent" onClick={onButtonClick}>
							Update data
						</button>
					</div>
				</div>
			</Fragment>
		)
	}
}

export default ViewB;