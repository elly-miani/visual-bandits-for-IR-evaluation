import printLog from '../helper/printLog.js';

export default function useAPI(url, callback) {
	const verbosity = 2;

	printLog("API", "Calling fetchAPI for", url, "useAPI()", 0, verbosity);

	fetch(url, {
		method: "GET",
		headers: new Headers({
			Accept: "application/json"
		})
	})
		.then(res => res.json())
		.then(callback)
		.catch(error => console.log(error));
}