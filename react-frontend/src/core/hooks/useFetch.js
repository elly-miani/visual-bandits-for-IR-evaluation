import { useState, useEffect } from 'react'

const useFetch = (url) => {

	console.log("📥 Calling useFetch Hook for", url);

	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		console.log("📥 Calling useEffect Hook inside useFetch");

		const fetchData = async () => {
			try {
				const res = await fetch(url);
				const json = await res.json();
				setResponse(json);
			} catch (error) {
				setError(error);
			}
		};
		fetchData();
	}, []);

	return { response, error };
};

export default useFetch;