import React, { useRef } from 'react';
import { IconButton } from 'rsuite';

import iconChooser from '../../../core/helper/iconChooser'
export default function ComputeAdjudicationButton(props) {

	return (
		<IconButton 
			icon={iconChooser(
												props.statusAdjudication !== 'done' && props.statusAdjudication !== 'idle', 
												'rocket'
						)}
			appearance="default"
			onClick={() => props.computeAdjudication()}
			className="controls-button"
		>
			Compute Adjudication
		</IconButton>
	);
}
