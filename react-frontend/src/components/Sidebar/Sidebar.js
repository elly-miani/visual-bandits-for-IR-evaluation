import React, { useState, useEffect } from 'react';
import { ButtonToolbar, Icon, IconButton, Button } from 'rsuite';

import './Sidebar.css';


export default function Sidebar(props) {

	// const [history, setHistory] = useState([]);

	// useEffect(() => {
	// 	if(props.adjudicationProgress.type === 'increment') {
	// 		if (history.length <= props.adjudicationProgress.value) {
	// 			setHistory(history.concat('hello' + (props.adjudicationProgress.value)));
	// 		}
	// 	}
	// }, [props.adjudicationProgress])

	// const backIsEnabled = props.adjudicationProgress.value === 0;

	return (
		<div className="inset">
			<div className="controls">

				<ButtonToolbar>
					<IconButton 
						icon={<Icon icon="arrow-left" />} 
						placement="right"
						disabled={props.adjudicationProgress.value === 0}
						onClick={() => props.updateAdjudicationProgress('decrement')}
					/>
					<IconButton icon={<Icon icon="play" />} placement="left" />
					{/* <IconButton icon={<Icon icon="pause" />} placement="left" /> */}
					<IconButton icon={<Icon icon="stop" />} placement="left" />
					<IconButton 
						icon={<Icon icon="arrow-right" />} 
						placement="right" 
						disabled={props.adjudicationProgress.value >= props.poolSize -1}
						onClick={() => props.updateAdjudicationProgress('increment')}
					/>

					{/* <Button appearance="subtle">{history[props.adjudicationProgress.value]}</Button> */}
					{/* <Button appearance="subtle">{props.adjudicationProgress.value}</Button> */}

				</ButtonToolbar>
				<div id="retrieved-document">
					Retrieved document #{props.adjudicationProgress.value}
				</div>

			</div>
		</div>
	);
}
