import printLog from '../helper/printLog.js';

function handleErrors(response) {
	if (response.status === 404)
		console.log("Data not yet available.");
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}

export default function fetchAPI(printLogHelper, url, callback) {
	printLog("API", "Calling useAPI for", url, printLogHelper);

	fetch(url, {
		method: "GET",
		headers: new Headers({
			Accept: "application/json"
		})
	})
		.then(handleErrors)
		.then(res => res.json())
		.then(callback)
		.catch(error => {
				// console.log(error)
		});
}