import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';

import './ViewB.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';

function ViewB() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "ViewB()",
		verbosity: [0, 1, 1, 0, 0],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //
	

	const [urlGridChart, setUrlGridChart] = useState('/api/mockdata/GridChart')
	const [urlQrels, setUrlQrels] = useState('/api/mockdata/qrels_topic_401')

	const [urlcontrol, setUrlControl] = useState(1);

	const [state, setState] = useState({
		"pool-depth": 10, 
		"topic": 401, 
		"show-qrels": 1
	});

	const [data, setData] = useState(null);
	const [qrels, setQrels] = useState(null);

	// printLog("PRINT", "Data at render is:", data, printLogHelper.current);
	// printLog("PRINT", "qrels at render are:", qrels, printLogHelper.current);

	useEffect(() => {
		fetchAPI(printLogHelper.current, urlGridChart, res => {
			setData(res);
		});
	}, [urlGridChart])

	useEffect(() => {
		fetchAPI(printLogHelper.current, urlQrels, res => {
			setQrels(res);
		});
	}, [urlQrels])

	
	const onButtonClick = () => {
		printLog("FUNCTION_CALL", "onButtonClick()", null, printLogHelper.current);
		printLog("PRINT", "urlcontrol =", urlcontrol, printLogHelper.current);

		if (urlcontrol) {
			setUrlControl(0);
			setUrlGridChart('/api/mockdata/GridChart2');
		}
		else {
			setUrlControl(1);
			setUrlGridChart('/api/mockdata/GridChart');
		}
	};

	if (data != null && qrels != null) {
		return (
			<Fragment>
				<div id="container--viewB" className="offset">
					<GridChart state={state} data={data} qrels={qrels}/>
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
	else {
		return (
			<Fragment>
				<div id="container--viewB" className="offset">
					<div>Loading...</div>
				</div>
			</Fragment>
		)
	}
}

export default ViewB;