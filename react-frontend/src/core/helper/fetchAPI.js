export default function useAPI(url, callback) {

	console.log("📥 Calling fetchAPI for", url);

	fetch(url)
		.then(res => res.json())
		.then(callback);
		
}