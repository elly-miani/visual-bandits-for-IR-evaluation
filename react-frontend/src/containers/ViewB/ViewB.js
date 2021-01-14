import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';

import './ViewB.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';

function ViewB() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const renderCount = useRef(1);
	// verbosity = [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
	// const verbosity = [0, 0, 0, 0, 0];
	const verbosity = [0, 0, 0, 0, 0];

	useEffect(() => {
		renderCount.current = renderCount.current + 1;
		printLog("RENDER", null, null, "ViewB()", renderCount.current, verbosity);
	})
	// == == == == == == == == == == == == == == == == == == == //
	

	const [url, setUrl] = useState('/api/mockdata/json/GridChart')
	// const [urlcontrol, setUrlControl] = useState(1);
	// const url = '/api/mockdata/json/GridChart';

	const [data, setData] = useState(null);
	printLog("PRINT", "Data at render is", data, "ViewB()", renderCount.current, verbosity);

	const updateData = useCallback(() => {
		printLog("FUNCTION_CALL", "updateData()", null, "ViewB()", renderCount.current, verbosity);

		fetchAPI(verbosity, url, res => {
			// const newdata = res.map(data => (data.score))
			const newdata = res
			setData(newdata);
		});
	}, [url]);

	useEffect(() => {
		printLog("HOOK", "useEffect([updateData])", null, "ViewB()", renderCount.current, verbosity);
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