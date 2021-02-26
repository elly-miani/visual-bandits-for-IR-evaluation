import React, { useRef } from 'react';

import { Icon, IconButton } from 'rsuite';

export default function StartAdjudicationButton(props) {
	const adjudicationButton = useRef();

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

	return (
		<IconButton ref={adjudicationButton}
			icon={iconChooser(props.status.adjudication)}
			appearance="default"
			onClick={() => props.handleClick()}
			className="controls-button"
		>
			Compute Adjudication
		</IconButton>
	);
}
