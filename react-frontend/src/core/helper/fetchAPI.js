export default function useAPI(url, callback) {

	console.log("📥 Calling fetchAPI for", url);

	// const response = null;
	// const error = null;

	// fetch(url, callback)
	// 	.then(res => res.json())
	// 	.then(json => { 
	// 		console.log("What the hell:", json);
	// 		return json; 
	// 	});

	fetch(url)
		.then(res => res.json())
		.then(callback);

	// return { response, error };
}