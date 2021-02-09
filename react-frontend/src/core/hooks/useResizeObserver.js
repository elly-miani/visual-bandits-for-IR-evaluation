
import { useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import printLog from '../../core/helper/printLog.js';

const useResizeObserver = (ref, printLogHelper) => {

	const [dimensions, setDimensions] = useState(null);

	useEffect(() => {
		const observeTarget = ref.current;
		const resizeObserver = new ResizeObserver((entries) => {

			printLog("HOOK", "useResizeObserver()", entries, printLogHelper);

			// set dimensions
			entries.forEach(entry => {
				setDimensions(entry.contentRect);
			})

		});

		// telling resizeObserver what to observe
		resizeObserver.observe(observeTarget);

		// clean-up function to unmount the observer
		return () => {
			resizeObserver.unobserve(observeTarget);
		}
	}, [ref]);

	return dimensions;
}

export default useResizeObserver;