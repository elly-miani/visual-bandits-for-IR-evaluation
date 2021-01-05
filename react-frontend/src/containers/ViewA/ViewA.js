import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import ExampleChart2 from '../../components/ExampleChart/ExampleChart';

function ViewA() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const renderCount = useRef(1);
	const verbosity = 0;

	useEffect(() => {
		renderCount.current = renderCount.current + 1;
		printLog("RENDER", null, null, "viewA()", renderCount.current, verbosity);
	})
	// == == == == == == == == == == == == == == == == == == == //
	

	const [url, setUrl] = useState('/api/data')
	const [urlcontrol, setUrlControl] = useState(1);
	const [data, setData] = useState([]);
	printLog("PRINT", "Data at render is", data, "viewA()", renderCount.current, verbosity);
	

	const updateData = useCallback(() => {
		fetchAPI(url, res => {
			const newdata = res.map(data => (data.score))
			setData(newdata);
		});
	}, [url]);


	const onButtonClick = () => {
		printLog("PRINT", "urlcontrol =", urlcontrol, "onButtonClick()", renderCount.current, verbosity);

		if(urlcontrol) {
			setUrlControl(0);
			setUrl('/api/data2'); 
		}
		else {
			setUrlControl(1);
			setUrl('/api/data');
		}
	};

	useEffect(() => {
		updateData();
	}, [updateData]);

	return (
		<div id="container--viewA" className="offset">
			<ExampleChart2 data={data}/>
			<br/>
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
	)
}

export default ViewA;