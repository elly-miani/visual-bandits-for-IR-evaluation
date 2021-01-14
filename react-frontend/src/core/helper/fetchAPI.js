import printLog from '../helper/printLog.js';

export default function useAPI(printLogHelper, url, callback) {
	
	printLog("API", "Calling useAPI for", url, printLogHelper);

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