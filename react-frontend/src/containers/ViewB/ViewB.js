import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';

import './ViewB.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';

import { Toggle, Icon } from 'rsuite';

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
	

	const [urlGridChart, setUrlGridChart] = useState('/api/mockdata/GridChart2')
	const [urlQrels, setUrlQrels] = useState('/api/mockdata/qrels_topic_401')

	// const [urlcontrol, setUrlControl] = useState(1);

	const [state, setState] = useState({
		"poolDepth": 10, 
		"topic": 401, 
		"showQrels": 0
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


	if (data != null && qrels != null) {
		return (
			<Fragment>
				<div id="container--viewB" className="offset">
					<div className="controls">
						<span style={{ "marginRight": "1em" }}>Show Relevance Judgments</span>
						<Toggle
							size="md"
							checkedChildren={<Icon icon="check" />}
							unCheckedChildren={<Icon icon="close" />}
							onChange={(checked, event) => {
								if (checked) {
									setState(prevState => {
										return { ...prevState, "showQrels": 1 }
									});
								}
								else {
									setState(prevState => {
										return { ...prevState, "showQrels": 0 }
									});
								}
							}}
						/>

						<span style={{ "marginRight": "1em", "marginLeft": "1em", }}>Data displayed</span>
						<Toggle
							size="md"
							checkedChildren={"GridChart"}
							unCheckedChildren={"GridChart2"}
							onChange={(checked, event) => {
								if (checked) {
									setUrlGridChart('/api/mockdata/GridChart');
								}
								else {
									setUrlGridChart('/api/mockdata/GridChart2');
								}
							}}
						/>
					</div>

					<br />

					<GridChart state={state} data={data} qrels={qrels}/>
					{/* {JSON.stringify(data, null, 2)} */}
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