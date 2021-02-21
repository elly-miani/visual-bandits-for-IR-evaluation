import React, { Fragment, useEffect, useState, useRef } from 'react';

import './ViewB.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';

import { Toggle, Icon, SelectPicker, Loader, InputGroup, InputNumber } from 'rsuite';

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
	

	const urlQrels = '/api/qrels/';
	const urlRuns = '/api/runs/'
	const urlRetrievedDocsMockdata = '/api/mockdata/retrieved_docs_order'

	const [topic, setTopic] = useState('401');
	const [runSize, setRunSize] = useState('10');

	const [state, setState] = useState({
		"showQrels": 0
	});

	const [runs, setRuns] = useState(null);
	const [qrels, setQrels] = useState(null);
	const [retrievedDocs, setRetrievedDocs] = useState(null);

	// printLog("PRINT", "runs at render is:", runs, printLogHelper.current);
	// printLog("PRINT", "qrels at render are:", qrels, printLogHelper.current);

	useEffect(() => {
		let url = urlRuns + topic;

		fetchAPI(printLogHelper.current, url, res => {
			setRuns(res);
		});

	}, [topic])

	useEffect(() => {
		let url = urlQrels + topic;

		fetchAPI(printLogHelper.current, url, res => {
			setQrels(res);
		});

	}, [topic])

	useEffect(() => {
		let url = urlRetrievedDocsMockdata;

		fetchAPI(printLogHelper.current, url, res => {
			setRetrievedDocs(res);
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
			size="sm"
			onChange ={(value, event) => {
				setTopic(value)
			}}
		/>
	);

	const runSizePickerRef = React.createRef();

	const runSizePicker = (
		<InputGroup>
			<InputGroup.Button 
				onClick={() => {
					runSizePickerRef.current.handleMinus();
				}}
				>-
			</InputGroup.Button>
			<InputNumber
				className={'custom-input-number'}
				ref={runSizePickerRef}
				size="sm"
				style={{ width: 100 }}
				max={100}
				min={10}
				step={5}
				defaultValue="10"
				onChange={(value, event) => {
					setRunSize(value)
				}}
			/>
			<InputGroup.Button 
				onClick={() => {
					runSizePickerRef.current.handlePlus();
				}}>
				+
			</InputGroup.Button>
		</InputGroup>
	);

	const relJudgmentsToogle = (
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
	);


	if (runs !== null && qrels !== null) {
		return (
			<Fragment>
				<div id="container--viewB" className="offset">
					<div className="controls">

						<div>
							<span className="toggle-label">Topic</span>
							{topicPicker}
						</div>

						<div>
							<span className="toggle-label">Run Size</span>
							<div className="inline-input-group">
								{runSizePicker}
							</div>
						</div>

						<div>
							<span className="toggle-label">Show Relevance Judgments</span>
							{relJudgmentsToogle}
						</div>
					</div>

					<br />

					<GridChart state={state} runs={runs} qrels={qrels} runSize={runSize} retrievedDocs={retrievedDocs}/>
				</div>
			</Fragment>
		)
	}
	else {
		return (
			<Fragment>
				<div id="container--viewB" className="offset container-loading">
						<Loader content="loading..." vertical />
				</div>
			</Fragment>
		)
	}
}

export default ViewB;