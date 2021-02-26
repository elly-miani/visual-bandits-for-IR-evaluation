import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Loader } from 'rsuite';

import './ViewA.css';

import fetchAPI from '../../core/helper/fetchAPI.js'
import printLog from '../../core/helper/printLog.js';

import GridChart from '../../components/GridChart/GridChart';
import BarChart from '../../components/BarChart/BarChart';
import Controls from '../../components/Controls/Controls';
import StartAdjudicationButton from '../../components/Controls/StartAdjudicationButton';

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
	

	// DATA STATUS
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


	// each time 'topic' is updated,
	// automatically fetch runs & qrels data 
	// and reset the adjudication data
	useEffect(() => {

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
		
	}, [topic])



	// function passed to <Controls /> component to handle states update
	const updateParameter = (newValue, parameter) => {
		if (parameter === 'topic') {
			setTopic(newValue)
		}
		if (parameter === 'adjudication-method') {
			setAdjudicationMethod(newValue)
		}
		if (parameter === 'pool-size') {
			setPoolSize(newValue)
		}
		if (parameter === 'run-size') {
			setRunSize(newValue)
		}
	}


	// function passed to <Controls /> component to start the adjudication process
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


	// CONDITIONAL RENDERING

	// when runs & qrels data has been fetched, but adjudication data has yet to be requested
	if (status.runs == 1 && status.qrels == 1 && status.adjudication == 2) {
		return (
			<Fragment>

				<Controls 
					status={status} 
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
				/>

				<GridChart 
					runs={runs} 
					qrels={qrels} 
					runSize={runSize} 
					retrievedDocs={retrievedDocs} 
				/>

				<div className="container container-loading offset">
					<StartAdjudicationButton status={status} handleClick={computeAdjudication} />
				</div>

			</Fragment>
		)
	}

	// when runs, qrels & adjudication data has been fetched
	if (status.runs == 1 && status.qrels == 1 && status.adjudication == 1) {
		return (
			<Fragment>

				<Controls
					status={status}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
				/>

				<GridChart 
					runs={runs} 
					qrels={qrels} 
					runSize={runSize} 
					retrievedDocs={retrievedDocs} 
				/>

				<BarChart runRelevancies={runRelevancies} />

			</Fragment>
		)
	}

	// when runs & qrels data has been fetched, but adjudication data is being retrieved
	if (status.runs == 1 && status.qrels == 1 && status.adjudication == 0) {
		return (
			<Fragment>

				<Controls
					status={status}
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
				/>

				<GridChart 
					runs={runs} 
					qrels={qrels} 
					runSize={runSize} 
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
					computeAdjudication={computeAdjudication}
					updateParameter={updateParameter}
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