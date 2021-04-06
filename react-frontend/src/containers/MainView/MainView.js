import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Loader } from 'rsuite';

import './MainView.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';
import useInterval from '../../core/hooks/useInterval';

import GridChart from '../../components/GridChart/GridChart';
import BarChart from '../../components/BarChart/BarChart';
import Controls from '../../components/Controls/Controls';
import Sidebar from '../../components/Sidebar/Sidebar';
import ComputeAdjudicationButton from '../../components/Controls/ComputeAdjudication/ComputeAdjudicationButton';
import loadData from '../../core/helper/loadData';


function MainView() {

	// == == == == == == == == PRINTLOG == == == == == == == == //
	const printLogHelper = useRef({
		renderingFunction: "ViewA()",
		verbosity: [0, 1, 1, 1, 1],						// [RENDER, API, PRINT, FUNCTION_CALL, HOOK]
		renderCount: 1
	});

	useEffect(() => {
		printLogHelper.current.renderCount = printLogHelper.current.renderCount + 1;
		printLog("RENDER", null, null, printLogHelper.current);
	})
	// == == == == == == == == == == == == == == == == == == == //
	

	// URLs
	const urlQrels = '/api/qrels';
	const urlRuns = '/api/runs'
	const urlAdjudication = '/api/adjudication'



	// == == == == == == == == == == == == == DATA == == == == == == == == == == == == == == == //
	
	const [runs, setRuns] = useState(null);
	const [qrels, setQrels] = useState(null);
	const [retrievedDocs, setRetrievedDocs] = useState(null);
	const [runRelevancies, setRunRelevancies] = useState(null);

	

	// == == == == == == == == == DATA LOADING & FETCHING STATUS == == == == == == == == == == //
	
	const [status, setStatus] = useState({
		dataLoading: 'inProgress',			// idle, inProgress, done
		runs: 'inProgress',							// inProgress, done
		qrels: 'inProgress',						// inProgress, done
		adjudication: 'idle'						// idle, inProgress, done
	})


	// function passed to children components to handle status updates
	const updateStatus = (status, value) => {
		switch (status) {
			case 'dataLoading':
				setStatus(prevState => {
					return {
						...prevState,
						dataLoading: value
					}
				})
				break;

			case 'runs':
				setStatus(prevState => {
					return {
						...prevState,
						runs: value
					}
				})
				break;

			case 'qrels':
				setStatus(prevState => {
					return {
						...prevState,
						qrels: value
					}
				})
				break;

			case 'adjudication':
				setStatus(prevState => {
					return {
						...prevState,
						adjudication: value
					}
				})
				break;

			case 'all':
				if (value === 'default')
					setStatus(prevState => {
						return {
							...prevState,
							runs: 'inProgress',
							qrels: 'inProgress',
							adjudication: 'idle'
						}
					})
				break;
				
			default:
				break;
		}
	}



	// == == == == == == == == == == == == PARAMETERS == == == == == == == == == == == == == == //
	
	const [dataParameters, setDataParameters] = useState({
		runsList: [],
		topicsList: []
	})

	const [topic, setTopic] = useState(null);
	const [runSize, setRunSize] = useState('10');
	const [poolSize, setPoolSize] = useState('100');
	const [adjudicationMethod, setAdjudicationMethod] = useState('round_robin')

	// function passed to children components to handle parameters updates
	const updateParameter = (value, parameter) => {
		switch (parameter) {
			case 'topic':
				setTopic(value);
				break;
			case 'adjudication-method':
				setAdjudicationMethod(value);
				break;
			case 'pool-size':
				setPoolSize(value);
				break;
			case 'run-size':
				setRunSize(value);
				break;
			case 'data-parameters':
				setDataParameters(value);
				break;
			default:
				break;
		}
	}


	// == == == == == == == == == == ADJUDICATION AUTOPLAY == == == == == == == == == == == == //

	const [adjudicationAutoplay, setAdjudicationAutoplay] = useState({
		status: 0,
		lastStep: 'next',
		paused: true
	});

	const updateAdjudicationAutoplay = (command) => {
		switch (command) {
			case 'next':
				setAdjudicationAutoplay(prevState => {
					return { ...prevState, status: prevState.status + 1, lastStep: 'next' }
				});
				break;

			case 'back':
				setAdjudicationAutoplay(prevState => {
					return { ...prevState, status: prevState.status - 1, lastStep: 'back' }
				});
				break;

			case 'play':
				setAdjudicationAutoplay(prevState => {
					return { ...prevState, paused: false }
				});
				break;

			case 'pause':
				setAdjudicationAutoplay(prevState => {
					return { ...prevState, paused: true }
				});
				break;

			case 'stop':
				setAdjudicationAutoplay({
					status: 0,
					lastStep: 'next',
					paused: true
				});
				break;
			default:
				break;
		}
	}

	useInterval(() => {
		if (adjudicationAutoplay.status < retrievedDocs.length - 1)
			updateAdjudicationAutoplay('next');
		else
			updateAdjudicationAutoplay('pause')
	}, !adjudicationAutoplay.paused ? 500 : null);



	const fetchData = () => {
		// printLog("FUNCTION_CALL", "Calling fetchData()", null, printLogHelper.current);
		updateStatus('all', 'default');
		updateAdjudicationAutoplay('stop')

		// reset adjudication data
		setRetrievedDocs(null);
		setRunRelevancies(null);

		// fetch runs data
		fetchAPI(printLogHelper.current, urlRuns + '?topic=' + topic, res => {
			setRuns(res);
			updateStatus('runs', 'done');
		});

		// fetch qrels data
		fetchAPI(printLogHelper.current, urlQrels + '?topic=' + topic, res => {
			setQrels(res);
			updateStatus('qrels', 'done');
		});
	}


	// function passed to <Controls /> component to start the adjudication process
	const computeAdjudication = () => {
		updateStatus('adjudication', 'inProgress');
		updateAdjudicationAutoplay('stop');

		let url = urlAdjudication + "?method=" + adjudicationMethod + '&topic=' + topic + '&poolDepth=' + poolSize;

		fetchAPI(printLogHelper.current, url, res => {
			setRetrievedDocs(res.retrieved_docs_order);
			setRunRelevancies(res.run_relevancies_order);
			updateStatus('adjudication', 'done');
		});
	}



	// load default data in backend at first render 
	useEffect(() => {
		updateStatus('dataLoading', 'inProgress');

		async function firstLoad() {
			const params = await loadData('default');
			setDataParameters(params);
			updateStatus('dataLoading', 'done');
			setTopic(params.topicsList[0])
		}

		firstLoad();
	}, [])


	// each time 'topic' is updated, fetch runs & qrels data, reset adjudication data
	useEffect(() => {
		// only if the data has already been loaded in backend
		if(status.dataLoading === 'done') fetchData();
	}, [topic])



	// when runs & qrels data has been fetched, but adjudication data has yet to be requested
	if (status.runs === 'done' && status.qrels === 'done' && status.adjudication === 'idle') {
		return (
			<Fragment>

				<Controls 
					status={status}
					dataParameters={dataParameters}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
					fetchData={fetchData}
				/>

				<div id="main-layout">
					<div id="charts">
						<GridChart
							runs={runs}
							qrels={qrels}
							runSize={runSize}
							runsList={dataParameters.runsList}
							retrievedDocs={retrievedDocs}
							adjudicationAutoplay={adjudicationAutoplay}
						/>

						<div className="container container-loading offset">
							<ComputeAdjudicationButton statusAdjudication={status.adjudication} computeAdjudication={computeAdjudication} />
						</div>

					</div>
					<div id="sidebar">
						<Sidebar
							adjudicationAutoplay={adjudicationAutoplay}
							updateAdjudicationAutoplay={updateAdjudicationAutoplay}
							poolSize={poolSize}
							retrievedDocs={retrievedDocs}
							runRelevancies={runRelevancies}
						/>
					</div>
				</div>

			</Fragment>
		)
	}

	// when runs, qrels & adjudication data has been fetched
	if (status.runs === 'done' && status.qrels === 'done' && status.adjudication === 'done') {
		return (
			<Fragment>

				<Controls
					status={status}
					dataParameters={dataParameters}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
					fetchData={fetchData}
				/>

				<div id="main-layout">
					<div id="charts">
						<GridChart
							runs={runs}
							qrels={qrels}
							runSize={runSize}
							runsList={dataParameters.runsList}
							retrievedDocs={retrievedDocs}
							adjudicationAutoplay={adjudicationAutoplay}
						/>

						<BarChart
							runRelevancies={runRelevancies}
							runsList={dataParameters.runsList}
							adjudicationAutoplay={adjudicationAutoplay}
						/>
					</div>
					
					<div id="sidebar">
						<Sidebar
							adjudicationAutoplay={adjudicationAutoplay}
							updateAdjudicationAutoplay={updateAdjudicationAutoplay}
							poolSize={poolSize}
							retrievedDocs={retrievedDocs}
							runRelevancies={runRelevancies}
						/>
					</div>
				</div>

			</Fragment>
		)
	}

	// when runs & qrels data has been fetched, but adjudication data is being retrieved
	if (status.runs === 'done' && status.qrels === 'done' && status.adjudication === 'inProgress') {
		return (
			<Fragment>

				<Controls
					status={status}
					dataParameters={dataParameters}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
					fetchData={fetchData}
				/>

				<div id="main-layout">
					<div id="charts">
						<GridChart
							runs={runs}
							qrels={qrels}
							runSize={runSize}
							runsList={dataParameters.runsList}
							retrievedDocs={retrievedDocs}
							adjudicationAutoplay={adjudicationAutoplay}
						/>

						<div className="container container-loading offset">
							<Loader content="loading..." vertical size="md" />
						</div>
					</div>
					<div id="sidebar">
						<Sidebar
							adjudicationAutoplay={adjudicationAutoplay}
							updateAdjudicationAutoplay={updateAdjudicationAutoplay}
							poolSize={poolSize}
							retrievedDocs={retrievedDocs}
							runRelevancies={runRelevancies}
						/>
					</div>
				</div>

			</Fragment>
		)
	}

	// when runs & qrels data has not yet been fetched
	if (status.runs === 'inProgress' || status.qrels === 'inProgress'){
		return (
			<Fragment>

				<Controls
					status={status}
					dataParameters={dataParameters}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
					fetchData={fetchData}
				/>

				<div id="main-layout">
					<div id="charts">

						<div id="container--ViewA" className="container offset">
							<div className="container-loading">
								<Loader content="loading..." vertical size="md" />
							</div>
						</div>

					</div>
					<div id="sidebar">

						<Sidebar
							adjudicationAutoplay={adjudicationAutoplay}
							updateAdjudicationAutoplay={updateAdjudicationAutoplay}
							poolSize={poolSize}
							retrievedDocs={retrievedDocs}
							runRelevancies={runRelevancies}
						/>

					</div>
				</div>

			</Fragment>
		)
	}
}

export default MainView;