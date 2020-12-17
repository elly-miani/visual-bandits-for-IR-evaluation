import { useState, useEffect } from 'react'

const useFetch = (url) => {

	console.log("📥 Calling useFetch Hook for", url);
	
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(url)
			.then(response => response.json())
			.then(data => setData(data));
	}, []);

	return data;
};

export default useFetch;