import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';

import './ViewB.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';

function ViewB() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "ViewB()",
		verbosity: [1, 1, 0, 0, 0],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //
	

	const [url, setUrl] = useState('/api/mockdata/json/GridChart')
	// const [urlcontrol, setUrlControl] = useState(1);
	// const url = '/api/mockdata/json/GridChart';

	const [data, setData] = useState(null);
	printLog("PRINT", "Data at render is:", data, printLogHelper.current);

	const updateData = useCallback(() => {
		printLog("FUNCTION_CALL", "updateData()", null, printLogHelper.current);

		fetchAPI(printLogHelper.current, url, res => {
			// const newdata = res.map(data => (data.score))
			const newdata = res
			setData(newdata);
		});
	}, [url]);

	useEffect(() => {
		printLog("HOOK", "useEffect([updateData])", null, printLogHelper.current);
		updateData();
	}, [updateData]);

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
				</div>
			</Fragment>
		)
	}
	// return (
	// 		<Fragment>
	// 			<div id="container--viewB" className="offset">
	// 				{JSON.stringify(data, null, 2)}
	// 			</div>
	// 		</Fragment>
	// 	)
}

export default ViewB;