import printLog from '../helper/printLog.js';

export default function useAPI(verbosity, url, callback) {

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