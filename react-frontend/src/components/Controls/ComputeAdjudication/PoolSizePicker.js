import React, { useRef } from 'react';
import { InputGroup, InputNumber } from 'rsuite';

export default function PoolSizePicker(props) {
	const poolSizePickerRef = useRef();

	return (
		<InputGroup>
			<InputGroup.Button
				onClick={() => {
					poolSizePickerRef.current.handleMinus();
				}}
			>-
			</InputGroup.Button>
			<InputNumber
				className={'custom-input-number'}
				ref={poolSizePickerRef}
				size="m"
				style={{ width: 60 }}
				min={10}
				step={10}
				defaultValue="10"
				onChange={(value, event) => {
					props.updateParameter(value, 'pool-size')
				}}
			/>
			<InputGroup.Button
				onClick={() => {
					poolSizePickerRef.current.handlePlus();
				}}>
				+
			</InputGroup.Button>
		</InputGroup>
	);
}
