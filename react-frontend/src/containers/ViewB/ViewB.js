import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';

import './ViewB.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';

import { Toggle, Icon, SelectPicker, Placeholder, Loader } from 'rsuite';

function ViewB() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "ViewB()",
		verbosity: [0, 1, 1, 0, 1],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //
	

	const [urlGridChart, setUrlGridChart] = useState('/api/mockdata/GridChart2')
	// const [urlQrels, setUrlQrels] = useState('/api/mockdata/qrels/401')
	const urlQrels = '/api/mockdata/qrels/';
	const urlRuns = '/api/runs/'

	const [topic, setTopic] = useState('401');
	const [poolDepth, setPoolDepth] = useState('10');
	// const [urlcontrol, setUrlControl] = useState(1);

	const [state, setState] = useState({
		"showQrels": 0
	});

	const [data, setData] = useState(null);
	const [qrels, setQrels] = useState(null);


	// printLog("PRINT", "Data at render is:", data, printLogHelper.current);
	// printLog("PRINT", "qrels at render are:", qrels, printLogHelper.current);

	useEffect(() => {
		let url = urlRuns + topic + "/" + poolDepth;

		fetchAPI(printLogHelper.current, url, res => {
			setData(res);
		});

	}, [topic, poolDepth])

	useEffect(() => {
		let url = urlQrels + topic;

		fetchAPI(printLogHelper.current, url, res => {
			setQrels(res);
		});

	}, [topic])


	const topicPicker = (
		<SelectPicker 
			data={[
				{
					"label": "401",
					"value": 401
				},
				{
					"label": "402",
					"value": 402
				},
				{
					"label": "403",
					"value": 403
				},
				{
					"label": "404",
					"value": 404
				},
				{
					"label": "405",
					"value": 405
				},
				{
					"label": "406",
					"value": 406
				},
				{
					"label": "407",
					"value": 407
				}
			]}
			placeholder="Default: 401"
			defaultValue="401"
			style={{ width: 150 }} 
			size="xs"
			onChange ={(value, event) => {
				setTopic(value)
			}}
		/>
	);

	const poolDepthPicker = (
		<SelectPicker
			data={[
				{
					"label": "1",
					"value": 1
				},
				{
					"label": "2",
					"value": 2
				},
				{
					"label": "3",
					"value": 3
				},
				{
					"label": "4",
					"value": 4
				},
				{
					"label": "5",
					"value": 5
				},
				{
					"label": "6",
					"value": 6
				},
				{
					"label": "7",
					"value": 7
				},
				{
					"label": "8",
					"value": 8
				},
				{
					"label": "9",
					"value": 9
				},
				{
					"label": "10",
					"value": 10
				}
			]}
			placeholder="Default: 10"
			defaultValue="10"
			style={{ width: 100 }}
			size="xs"
			onChange={(value, event) => {
				setPoolDepth(value)
			}}
		/>
	);


	if (data !== null && qrels !== null) {
		return (
			<Fragment>
				<div id="container--viewB" className="offset">
					<div className="controls">

						<span>
							<span className="toggle-label">Topic</span>
							{topicPicker}
						</span>

						<span>
							<span className="toggle-label">Pool Depth</span>
							{poolDepthPicker}
						</span>

						<span>
							<span className="toggle-label">Show Relevance Judgments</span>
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
						</span>
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
				<div id="container--viewB" className="offset container-loading">
					{/* <Placeholder.Paragraph rows={8}> */}
						<Loader content="loading..." vertical />
					{/* </Placeholder.Paragraph> */}
				</div>
			</Fragment>
		)
	}
}

export default ViewB;