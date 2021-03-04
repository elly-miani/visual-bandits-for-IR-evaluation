import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Loader } from 'rsuite';

import './ViewA.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';
import BarChart from '../../components/BarChart/BarChart';
import Controls from '../../components/Controls/Controls';
import StartAdjudicationButton from '../../components/Controls/StartAdjudicationButton';
import loadData from '../../core/helper/loadData';


function ViewA() {

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
	const urlQrels = '/api/qrels/';
	const urlRuns = '/api/runs/'
	const urlAdjudication = '/api/adjudication/'
	

	// PARAMETERS
	const [datasetParam, setDatasetParam] = useState({
		runsList: [],
		topicsList: []
	})

	const [topic, setTopic] = useState(null);
	const [runSize, setRunSize] = useState('10');
	const [poolSize, setPoolSize] = useState('100');
	const [adjudicationMethod, setAdjudicationMethod] = useState('round_robin')


	// DATA STATUS
	const [status, setStatus] = useState({
		loading: 2,
		runs: 0,
		qrels: 0,
		adjudication: 2
	})


	// DATA
	const [runs, setRuns] = useState(null);
	const [qrels, setQrels] = useState(null);
	const [retrievedDocs, setRetrievedDocs] = useState(null);
	const [runRelevancies, setRunRelevancies] = useState(null);

	

	const fetchData = () => {

		printLog("FUNCTION_CALL", "Calling fetchData()", null, printLogHelper.current);
		// udpate status
		setStatus(prevState => {
			return {
				...prevState,
				runs: 0,
				qrels: 0,
				adjudication: 2
			}
		})

		// reset adjudication data
		setRetrievedDocs(null);
		setRunRelevancies(null);

		// fetch runs data
		fetchAPI(printLogHelper.current, urlRuns + topic, res => {
			setRuns(res);

			setStatus(prevState => {
				return {
					...prevState,
					runs: 1
				}
			})
		});

		// fetch qrels data
		fetchAPI(printLogHelper.current, urlQrels + topic, res => {
			setQrels(res);

			setStatus(prevState => {
				return {
					...prevState,
					qrels: 1
				}
			})
		});
	}



	// function passed to <Controls /> component to handle states' updates
	const updateParameter = (newValue, parameter) => {
		if (parameter === 'topic') {
			setTopic(newValue);
		}
		if (parameter === 'adjudication-method') {
			setAdjudicationMethod(newValue);
		}
		if (parameter === 'pool-size') {
			setPoolSize(newValue);
		}
		if (parameter === 'run-size') {
			setRunSize(newValue);
		}
		if (parameter === 'dataset-param') {
			setDatasetParam(newValue);
		}
	}



	// function passed to <Controls /> component to start the adjudication process
	const computeAdjudication = () => {
		setStatus(prevState => {
			return {
				...prevState,
				adjudication: 0
			}
		});

		let url = urlAdjudication + adjudicationMethod + '/' + topic + '/' + poolSize;

		fetchAPI(printLogHelper.current, url, res => {
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



	useEffect(() => {
		setStatus(prevState => {
			return {
				...prevState,
				loading: 2
			}
		})

		async function firstLoad() {
			const params = await loadData('default');

			setDatasetParam(params);
			setStatus(prevState => {
				return {
					...prevState,
					loading: 1
				}
			})
			setTopic(params.topicsList[0])
		}
		firstLoad();
	}, [])



	// each time 'topic' is updated,
	// automatically fetch runs & qrels data 
	// and reset the adjudication data
	useEffect(() => {
		if(status.loading !== 2) fetchData();
	}, [topic])



	// CONDITIONAL RENDERING

	// when runs & qrels data has been fetched, but adjudication data has yet to be requested
	if (status.runs === 1 && status.qrels === 1 && status.adjudication === 2) {
		return (
			<Fragment>

				<Controls 
					status={status} 
					datasetParam={datasetParam}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
					fetchData={fetchData}
				/>

				<GridChart 
					runs={runs} 
					qrels={qrels} 
					runSize={runSize} 
					runsList={datasetParam.runsList}
					retrievedDocs={retrievedDocs} 
				/>

				<div className="container container-loading offset">
					<StartAdjudicationButton status={status} handleClick={computeAdjudication} />
				</div>

			</Fragment>
		)
	}

	// when runs, qrels & adjudication data has been fetched
	if (status.runs === 1 && status.qrels === 1 && status.adjudication === 1) {
		return (
			<Fragment>

				<Controls
					status={status}
					datasetParam={datasetParam}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
					fetchData={fetchData}
				/>

				<GridChart 
					runs={runs} 
					qrels={qrels} 
					runSize={runSize}
					runsList={datasetParam.runsList}
					retrievedDocs={retrievedDocs} 
				/>

				<BarChart 
					runRelevancies={runRelevancies}
					runsList={datasetParam.runsList}
				/>

			</Fragment>
		)
	}

	// when runs & qrels data has been fetched, but adjudication data is being retrieved
	if (status.runs === 1 && status.qrels === 1 && status.adjudication === 0) {
		return (
			<Fragment>

				<Controls
					status={status}
					datasetParam={datasetParam}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
					fetchData={fetchData}
				/>

				<GridChart 
					runs={runs} 
					qrels={qrels} 
					runSize={runSize}
					runsList={datasetParam.runsList}
					retrievedDocs={retrievedDocs} />
				
				<div className="container container-loading offset">
					<Loader content="loading..." vertical size="md" />
				</div>

			</Fragment>
		)
	}

	// when runs & qrels data has not yet been fetched
	if (!status.runs || !status.qrels){
		return (
			<Fragment>

				<Controls
					status={status}
					datasetParam={datasetParam}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
					fetchData={fetchData}
				/>

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