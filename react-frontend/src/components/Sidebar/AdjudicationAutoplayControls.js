import React from 'react';
import { ButtonToolbar, Icon, IconButton } from 'rsuite';


const PlayPause = function (props) {
	if (props.adjudicationAutoplay.paused === true) {
		return (
			<IconButton
				icon={<Icon icon="play" />}
				disabled={props.disable}
				onClick={() => props.updateAdjudicationAutoplay('play')}
			/>
		)
	}
	else {
		return (
			<IconButton
				icon={<Icon icon="pause" />}
				onClick={() => props.updateAdjudicationAutoplay('pause')}
			/>
		)
	}
}


export default function AdjudicationAutoplayControls(props) {
	return (

		<ButtonToolbar>
			<div id="autoplay-controls">
				<IconButton
					icon={<Icon icon="arrow-left" />}
					disabled={
						props.adjudicationAutoplay.status === 0
						|| props.adjudicationAutoplay.paused === false
						|| props.disable
					}
					onClick={() => props.updateAdjudicationAutoplay('back')}
				/>

				<PlayPause
					adjudicationAutoplay={props.adjudicationAutoplay}
					updateAdjudicationAutoplay={props.updateAdjudicationAutoplay}
					disable={props.disable}
				/>

				<IconButton
					icon={<Icon icon="stop" />}
					disabled={props.disable}
					onClick={() => props.updateAdjudicationAutoplay('stop')}
				/>

				<IconButton
					icon={<Icon icon="arrow-right" />}
					disabled={
						props.adjudicationAutoplay.value >= props.poolSize - 1
						|| props.adjudicationAutoplay.paused === false
						|| props.disable
					}
					onClick={() => props.updateAdjudicationAutoplay('next')}
				/>
			</div>
		</ButtonToolbar>
		
	)
}