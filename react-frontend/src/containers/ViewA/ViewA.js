import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';

import './ViewA.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import ExampleChart2 from '../../components/ExampleChart/ExampleChart';

function ViewA() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const renderCount = useRef(1);
	// verbosity = [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
	const verbosity = [0, 0, 0, 0, 0];
	// const verbosity = [1, 1, 1, 1, 1];

	useEffect(() => {
		renderCount.current = renderCount.current + 1;
		printLog("RENDER", null, null, "viewA()", renderCount.current, verbosity);
	})
	// == == == == == == == == == == == == == == == == == == == //
	

	const [url, setUrl] = useState('/api/mockdata/fake_data1')
	const [urlcontrol, setUrlControl] = useState(1);
	const [data, setData] = useState([]);
	printLog("PRINT", "Data at render is", data, "viewA()", renderCount.current, verbosity);

	const updateData = useCallback(() => {
		printLog("FUNCTION_CALL", "updateData()", null, "ViewA()", renderCount.current, verbosity);

		fetchAPI(verbosity, url, res => {
			const newdata = res.map(data => (data.score))
			setData(newdata);
		});
	}, [url]);


	const onButtonClick = () => {
		printLog("FUNCTION_CALL", "onButtonClick()", null, "ViewA()", renderCount.current, verbosity);
		printLog("PRINT", "urlcontrol =", urlcontrol, "ViewA()", renderCount.current, verbosity);

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
		printLog("HOOK", "useEffect([updateData])", null, "ViewA()", renderCount.current, verbosity);
		updateData();
	}, [updateData]);

	return (
		<Fragment>
			<div id="container--viewA" className="offset">
				<ExampleChart2 data={data} />
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

export default ViewA;