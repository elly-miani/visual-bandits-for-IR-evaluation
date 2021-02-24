import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';

import './ExampleView.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import ExampleChart from '../../components/ExampleChart/ExampleChart';

function ExampleView() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "ExampleView()",
		verbosity: [0, 0, 0, 0, 0],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //
	

	const [url, setUrl] = useState('/api/mockdata/fake_data1')
	const [urlcontrol, setUrlControl] = useState(1);
	const [data, setData] = useState([]);
	printLog("PRINT", "Data at render is:", data, printLogHelper.current);

	const updateData = useCallback(() => {
		printLog("FUNCTION_CALL", "updateData()", null, printLogHelper.current);

		fetchAPI(printLogHelper.current, url, res => {
			const newdata = res.map(data => (data.score))
			setData(newdata);
		});
	}, [url]);


	const onButtonClick = () => {
		printLog("FUNCTION_CALL", "onButtonClick()", null, printLogHelper.current);
		printLog("PRINT", "urlcontrol =", urlcontrol, printLogHelper.current);

		if(urlcontrol) {
			setUrlControl(0);
			setUrl('/api/mockdata/fake_data2'); 
		}
		else {
			setUrlControl(1);
			setUrl('/api/mockdata/fake_data1');
		}
	};

	useEffect(() => {
		printLog("HOOK", "useEffect([updateData])", null, printLogHelper.current);
		updateData();
	}, [updateData]);

	return (
		<Fragment>
			<div id="container--ExampleView" className="offset">
				<ExampleChart data={data} />
				<br />
				<div className="controls">
					<button className="button--3d button--accent" onClick={onButtonClick}>
						Update data
				</button>
					<button className="button--3d" onClick={() => setData(data.map(value => value + 5))}>
						Increment data
				</button>
					<button className="button--3d" onClick={() => setData(data.filter(value => value < Math.max(...data) / 2))}>
						Filter data
				</button>
					<button className="button--3d" onClick={() => setData([...data, Math.round(Math.random() * 100)])}>
						Add data
				</button>
				</div>
			</div>
			
		</Fragment>
	)
}

export default ExampleView;