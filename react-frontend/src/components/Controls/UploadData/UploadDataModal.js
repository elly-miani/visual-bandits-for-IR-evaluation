import React, { useState, useEffect } from 'react';
import { IconButton, Modal, Button, Uploader } from 'rsuite';

import './UploadDataModal.css';

import loadData from '../../../core/helper/loadData'
import iconChooser from '../../../core/helper/iconChooser'

export default function UploadDataModal(props) {


	const [runsFiles, setRunsFiles] = useState({ file: [] });
	const [qrelsFiles, setQrelsFiles] = useState({ file: [] });
	const [loadingAllowed, setLoadingAllowed] = useState(false);

	const addFile = (fileType, file) => {
		switch (fileType) {
			case 'runs':
				setRunsFiles({ file });
				break;
			case 'qrels':
				setQrelsFiles({ file });
				break;
		}
	}

	const deleteFile = (fileType, file) => {
		fetch("/api/delete/" + fileType + "/" + file, {
			method: 'DELETE'
		});
	}

	const resetFiles = () => {
		setRunsFiles({ file: [] });
		setQrelsFiles({ file: [] });
	}

	const isLoadingAllowed = () => {
		if (runsFiles.file.length > 0 && qrelsFiles.file.length === 1) {
			setLoadingAllowed(true);
		}
		else {
			setLoadingAllowed(false);
		}
	}

	const shouldQueueUpdate = (newFiles) => {
			for (let i in newFiles) {
				newFiles[i].name = newFiles[i].name.replace(/\s+/g, '_');
			}
			return true;
	}

	async function loadAndFetchData(type) {
		props.setStatus('inProgress');
		const param = await loadData(type);
		props.updateParameter(param, 'data-parameters');
		props.setStatus('done');
		props.setShowModal(false);
		props.fetchData();

		if (type === 'default') {
			resetFiles();
			setLoadingAllowed(false);
		} 
	}

	useEffect(() => {
		isLoadingAllowed();
	}, [runsFiles, qrelsFiles])


	return (
		<Modal show={props.showModal} onHide={() => { props.setShowModal(false); }}>

			<Modal.Header>
				<Modal.Title>Select Custom Runs & Qrels Files</Modal.Title>
			</Modal.Header>

			<Modal.Body>

				<Uploader draggable removable multiple
					action="/api/upload/runs"
					fileList={runsFiles.file}
					onChange={(file) => addFile('runs', file)}
					onRemove={(file) => deleteFile('runs', file.name)}
					onProgress={(percent) => {
						if (percent === 100) isLoadingAllowed();
						else setLoadingAllowed(false);
					}}
					shouldQueueUpdate={(newFiles) => shouldQueueUpdate(newFiles)}
					shouldUpload={() => { return true; }}
				>
					<div>Select at least one Runs File</div>
				</Uploader>

				<Uploader draggable removable multiple
					action="/api/upload/qrels"
					fileList={qrelsFiles.file}
					onChange={(file) => addFile('qrels', file)}
					onRemove={(file) => deleteFile('qrels', file.name)}
					onProgress={(percent) => {
						if (percent === 100) isLoadingAllowed();
						else setLoadingAllowed(false);
					}}
					shouldQueueUpdate={(newFiles) => shouldQueueUpdate(newFiles)}
					shouldUpload={() => { return true; }}
				>
					<div>Select one Qrels File</div>
				</Uploader>

			</Modal.Body>

			<Modal.Footer>

				<IconButton
					icon={props.icon()}
					onClick={() => loadAndFetchData('default')}
					className="controls-button"
				>
					Load Default Files
				</IconButton>

				<IconButton
					disabled={!loadingAllowed}
					icon={props.icon()}
					onClick={() => loadAndFetchData('custom') }
					appearance="primary"
					className="controls-button"
				>
					Load Selected Files
				</IconButton>

			</Modal.Footer>

		</Modal>
	);
}

	

