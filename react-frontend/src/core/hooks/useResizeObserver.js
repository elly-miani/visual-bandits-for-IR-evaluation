
import { useState, useEffect, useRef } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import printLog from '../../core/helper/printLog.js';

const useResizeObserver = (ref) => {

	// == == == == == == == == PRINTLOG == == == == == == == == //
  const renderCount = useRef(1);
	const verbosity = 0; // 5 for HOOK

	useEffect(() => {
		renderCount.current = renderCount.current + 1;
	})
	// == == == == == == == == == == == == == == == == == == == //

	const [dimensions, setDimensions] = useState(null);

	useEffect(() => {
		const observeTarget = ref.current;
		const resizeObserver = new ResizeObserver((entries) => {

			printLog("HOOK", null, entries, "useResizeObserver()", renderCount.current, verbosity);

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