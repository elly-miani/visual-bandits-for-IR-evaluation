import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Toggle, Icon, SelectPicker, Loader, InputGroup, InputNumber, IconButton, Button } from 'rsuite';

import './ViewA.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';
import BarChart from '../../components/BarChart/BarChart';


function ViewA() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "ViewA()",
		verbosity: [0, 1, 1, 0, 1],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //
	


	const [status, setStatus] = useState({
		runs: 0,
		qrels: 0,
		adjudication: 2
	})

	// URLs
	const urlQrels = '/api/qrels/';
	const urlRuns = '/api/runs/'
	const urlAdjudication = '/api/adjudication/'

	// PARAMETERS
	const [topic, setTopic] = useState('401');
	const [runSize, setRunSize] = useState('10');
	const [poolSize, setPoolSize] = useState('100');
	const [adjudicationMethod, setAdjudicationMethod] = useState('round_robin')

	// DATA
	const [runs, setRuns] = useState(null);
	const [qrels, setQrels] = useState(null);
	const [retrievedDocs, setRetrievedDocs] = useState(null);
	const [runRelevancies, setRunRelevancies] = useState(null);

	// printLog("PRINT", "runs at render is:", runs, printLogHelper.current);
	// printLog("PRINT", "qrels at render are:", qrels, printLogHelper.current);

	useEffect(() => {
		setStatus(prevState => {
			return {
				...prevState,
				runs: 0,
				qrels: 0,
				adjudication: 2
			}
		})

		setRetrievedDocs(null);
		setRunRelevancies(null);


		fetchAPI(printLogHelper.current, urlRuns + topic, res => {
			setRuns(res);

			setStatus(prevState => {
				return {
					...prevState,
					runs: 1
				}
			})
		});

		fetchAPI(printLogHelper.current, urlQrels + topic, res => {
			setQrels(res);

			setStatus(prevState => {
				return {
					...prevState,
					qrels: 1
				}
			})
		});

		
	}, [topic])


	const computeAdjudication = () => {
		setStatus(prevState => {
			return {
				...prevState,
				adjudication: 0
			}
		})
				
		let url = urlAdjudication + adjudicationMethod + '/' + topic + '/' + poolSize;

		fetchAPI(printLogHelper.current, url, res => {
			console.log(res.retrieved_docs_order);
			setRetrievedDocs(res.retrieved_docs_order);
			setRunRelevancies(res.run_relevancies_order);
			
			setStatus(prevState => {
				return {
					...prevState,
					adjudication: 1
				}
			})
		});
	}

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
				style={{ width: 60 }}
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

	const adjudicationMethodPicker = (
		<SelectPicker
			data={[
				{
					"label": "Round Robin",
					"value": "round_robin"
				},
				{
					"label": "x",
					"value": "x"
				}
			]}
			placeholder="Round Robin"
			defaultValue="round_robin"
			style={{ width: 150 }}
			size="sm"
			onChange={(value, event) => {
				setAdjudicationMethod(value)
			}}
		/>
	);

	const poolSizePickerRef = React.createRef();
	const poolSizePicker = (
		<InputGroup>
			<InputGroup.Button
				onClick={() => {
					poolSizePickerRef.current.handleMinus();
				}}
			>-
			</InputGroup.Button>
			<InputNumber
				className={'custom-input-number'}
				ref={poolSizePickerRef}
				size="sm"
				style={{ width: 60 }}
				min={50}
				step={50}
				defaultValue="100"
				onChange={(value, event) => {
					setPoolSize(value)
				}}
			/>
			<InputGroup.Button
				onClick={() => {
					poolSizePickerRef.current.handlePlus();
				}}>
				+
			</InputGroup.Button>
		</InputGroup>
	);


	function iconChooser(statusAdjudication) {
		if (statusAdjudication === 1 || statusAdjudication === 2) {
			return <Icon icon="rocket" />;
		}
		else {
			// return <Icon icon="cog" className="loader-icon" />;
			// return <Icon icon="refresh" className="loader-icon" />;
			return <Icon icon="spinner" className="loader-icon" />;
		}
	}

	const adjudicationButton = useRef();
	const controls = (
		<div className="controls-container inset">
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
					<span className="toggle-label">Strategy</span>
					{adjudicationMethodPicker}
				</div>

				<div>
					<span className="toggle-label">Pool Size</span>
					<div className="inline-input-group">
						{poolSizePicker}
					</div>
				</div>

				<IconButton ref={adjudicationButton}
					icon={iconChooser(status.adjudication)}
					appearance="default"
					onClick={() => computeAdjudication()}
				>
					Compute Adjudication
				</IconButton>

			</div>
		</div>
	);


	if (status.runs == 1 && status.qrels == 1 && status.adjudication == 2) {
		return (
			<Fragment>
				{controls}
				<GridChart runs={runs} qrels={qrels} runSize={runSize} retrievedDocs={retrievedDocs} />
				<div className="container container-loading offset">
					<Button appearance="ghost" onClick={() => { window.scrollTo(0, 0) }}>
						Compute adjudication to display chart.
					</Button>
				</div>
			</Fragment>
		)
	}
	if (status.runs == 1 && status.qrels == 1 && status.adjudication == 1) {
		return (
			<Fragment>
				{controls}
				<GridChart runs={runs} qrels={qrels} runSize={runSize} retrievedDocs={retrievedDocs} />
				<BarChart runRelevancies={runRelevancies} />
			</Fragment>
		)
	}
	if (status.runs == 1 && status.qrels == 1 && status.adjudication == 0) {
		return (
			<Fragment>
				{controls}
				<GridChart runs={runs} qrels={qrels} runSize={runSize} retrievedDocs={retrievedDocs} />
				<div className="container container-loading offset">
					<Loader content="loading..." vertical size="md" />
				</div>
			</Fragment>
		)
	}
	if (!status.runs || !status.qrels){
		return (
			<Fragment>
				{controls}
				<div id="container--ViewA" className="container offset">
					<div className="container-loading">
						<Loader content="loading..." vertical size="md" />
					</div>				
				</div>

			</Fragment>
		)
	}
}

export default ViewA;