import React, { useRef } from 'react';

import { InputGroup, InputNumber } from 'rsuite';

export default function RunSizePicker(props) {
	const runSizePickerRef = useRef();
	
	return (
		<InputGroup>
			<InputGroup.Button
				onClick={() => {
					runSizePickerRef.current.handleMinus();
				}}
			>-
			</InputGroup.Button>
			<InputNumber
				className={'custom-input-number'}
				ref={runSizePickerRef}
				size="sm"
				style={{ width: 60 }}
				max={100}
				min={10}
				step={5}
				defaultValue="10"
				onChange={(value, event) => {
					props.updateParameter(value, 'run-size')
				}}
			/>
			<InputGroup.Button
				onClick={() => {
					runSizePickerRef.current.handlePlus();
				}}>
				+
			</InputGroup.Button>
		</InputGroup>
	);
}
