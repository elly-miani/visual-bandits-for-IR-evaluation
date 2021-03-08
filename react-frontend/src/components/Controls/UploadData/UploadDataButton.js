import React, { useState, Fragment } from 'react';
import { IconButton } from 'rsuite';

import iconChooser from '../../../core/helper/iconChooser'
import UploadDataModal from './UploadDataModal'

export default function UploadDataButton(props) {

	// local status, to correctly display the icons on the buttons
	const [statusDataLoading, setStatusDataLoading] = useState('idle');
	const [showModal, setShowModal] = useState(false);

	const icon = () => {
		return iconChooser(
			statusDataLoading !== 'done' && statusDataLoading !== 'idle',
			'upload'
		)
	}

	return (
		<Fragment>
			<IconButton 
				icon={icon()}
				appearance="default"
				onClick={() => setShowModal(true)}
				className="controls-button"
			>
				Upload Data
			</IconButton>

			<UploadDataModal 
				icon={icon}
				showModal={showModal}
				setShowModal={setShowModal}
				setStatus={setStatusDataLoading}
				updateParameter={props.updateParameter}
				fetchData={props.fetchData}
			/>
		</Fragment>
	);
}