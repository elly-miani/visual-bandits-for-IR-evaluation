/* == == == == == == == == VERBOSITY LEGEND == == == == == == == == //
	0 -> RENDER ➡️
	1 -> API 📥
	2 -> PRINT 🖨
	3 -> FUNCTION_CALL ☎️
	4 -> HOOK 🪝
// == == == == == == == == == == == == == == == == == == == == == == */

export default function printLog(type, message, value, printLogHelper) {

	let icon;
	let renderingFunction = printLogHelper.renderingFunction;
	let renderNumber = printLogHelper.renderCount;
	let verbosity = printLogHelper.verbosity;											// verbosity = [0,0,0,0,0]

	switch (type) {
		case "RENDER":
			icon = "➡️";
			message = "Rendering"
			if(verbosity[0])
				console.log(icon, "[", renderingFunction, renderNumber, "]", message);
			break;
		case "API":
			icon = "📥";
			if(verbosity[1]){
				console.log("   ", icon, "[", renderingFunction, renderNumber, "]", message, value);
			}
			break;
		case "PRINT":
			icon = "🖨";
			if(verbosity[2]){
				console.log("   ", icon, "[", renderingFunction, renderNumber, "]", message);
				console.dir("   ", value);
			}
			break;
		case "FUNCTION_CALL":
			icon = "☎️";
			if (verbosity[3])
				console.log("   ", icon, "[", renderingFunction, renderNumber, "]", message);
			break;
		case "HOOK":
			icon = "🪝";
			if (verbosity[4])
				console.log("   ", icon, "[", renderingFunction, renderNumber, "]", message);
			break;
		default:
			icon = "📌 {{ }}";
	}
}