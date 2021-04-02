export default async function loadData (type) {
	const res = await fetch('/api/load-data/' + type, {
		method: "GET"
	});
	return await res.json();
}