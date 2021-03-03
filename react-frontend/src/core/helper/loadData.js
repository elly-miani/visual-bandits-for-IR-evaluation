export default async function loadData (type) {
	const res = await fetch('/api/loaddata/' + type, {
		method: "GET"
	});
	return await res.json();
}