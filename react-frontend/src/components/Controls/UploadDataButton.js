import React, { useRef, useState, useEffect, Fragment } from 'react';
import { Icon, IconButton, Modal, Button, Uploader } from 'rsuite';

import loadData from '../../core/helper/loadData'

export default function UploadDataButton(props) {
	const uploadDataButton = useRef();

	const [showModal, setShowModal] = useState(false);
	const [runsFiles, setRunsFiles] = useState({ file: [] });
	const [qrelsFiles, setQrelsFiles] = useState({ file: [] });

	const [allowLoading, setAllowLoading] = useState(false);
	const [loadingStatus, setLoadingStatus] = useState(1);

	function iconChooser(loadingStatus) {
		if (loadingStatus === 1 || loadingStatus === 2) {
			return <Icon icon="upload" />;
		}
		else {
			return <Icon icon="spinner" className="loader-icon" />;
		}
	}

	function deleteFile(filename, filetype) {
		fetch("/api/delete/" + filetype + "/" + filename, {
			method: 'DELETE'
		});
	}

	const checkLoading = () => {
		if (runsFiles.file.length > 0 && qrelsFiles.file.length === 1) {
			setAllowLoading(true);
		}
		else {
			setAllowLoading(false);
		}
	}

	useEffect(() => {
		checkLoading();
	}, [runsFiles, qrelsFiles])


	return (
		<Fragment>
			<IconButton ref={uploadDataButton}
				icon={iconChooser(loadingStatus)}
				appearance="default"
				onClick={() => setShowModal(true)}
				className="controls-button"
			>
				Upload Data
			</IconButton>

			<Modal show={showModal} onHide={() => { setShowModal(false); }}>

				<Modal.Header>
					<Modal.Title>Select Custom Runs & Qrels Files</Modal.Title>
				</Modal.Header>

				<Modal.Body>

					<Uploader draggable removable multiple
						action="/api/upload/runs"
						fileList={runsFiles.file}
						onChange={(file) => {
							setRunsFiles({ file });
						}}
						onRemove={(file) => {
							deleteFile(file.name, "runs");
						}}
						onProgress={(percent) => {
							if (percent === 100)
								checkLoading();
							else
								setAllowLoading(false);
						}}
						shouldQueueUpdate={(newFiles) => {
							for(let i in newFiles) {
								newFiles[i].name = newFiles[i].name.replace(/\s+/g, '_');
							}
							return true;
						}}
						shouldUpload={() => { return true; }}
					>
						<div>Select at least one Runs File</div>
					</Uploader>

					<Uploader draggable removable multiple
						action="/api/upload/qrels"
						fileList={qrelsFiles.file}
						onChange={(file) => {
							setQrelsFiles({ file });
						}}
						onRemove={(file) => {
							deleteFile(file.name, "qrels");
						}}
						onProgress={(percent) => {
							if (percent === 100)
								checkLoading();
							else
								setAllowLoading(false);
						}}
						shouldQueueUpdate={(newFiles) => {
							for (let i in newFiles) {
								newFiles[i].name = newFiles[i].name.replace(/\s+/g, '_');
							}
							return true;
						}}
						shouldUpload={() => { return true; }}
					>
						<div>Select one Qrels File</div>
					</Uploader>


				</Modal.Body>

				<Modal.Footer>
					
					<IconButton
						icon={iconChooser(loadingStatus)}
						onClick={async () => {
							setLoadingStatus(0);
							const param = await loadData('default');
							props.updateParameter(param, 'dataset-param');
							setLoadingStatus(1);
							setShowModal(false);
							props.fetchData();
							setRunsFiles({ file: [] });
							setQrelsFiles({ file: [] });
							setAllowLoading(false);
						}}
						className="controls-button"
					>
						Load Default Files
					</IconButton>

					<IconButton
						disabled={!allowLoading}
						icon={iconChooser(loadingStatus)}
						onClick={async () => {
							setLoadingStatus(0);
							const param = await loadData('custom');
							props.updateParameter(param, 'dataset-param');
							setLoadingStatus(1);
							setShowModal(false);
							props.fetchData();
						}}
						appearance="primary"
						className="controls-button"
					>
						Load Selected Files
					</IconButton>
					
				</Modal.Footer>

			</Modal>
		</Fragment>
	);
}