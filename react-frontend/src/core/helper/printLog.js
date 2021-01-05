/* == == == == == == == == VERBOSITY LEGEND == == == == == == == == //
	0 -> no logs shown
	1 -> RENDER ➡️ shown
	2 -> RENDER ➡️ & API 📥 shown
	3 -> RENDER ➡️ & API 📥 & PRINT 🖨 shown
	4 -> RENDER ➡️ & API 📥 & PRINT 🖨 & FUNCTION_CALL ☎️ shown
	5 -> RENDER ➡️ & API 📥 & PRINT 🖨 & FUNCTION_CALL ☎️ & HOOK 🪝 shown
// == == == == == == == == == == == == == == == == == == == == == == */

export default function printLog(type, message, value, renderingFunction, renderNumber, verbosity) {
	let icon;

	switch (type) {
		case "RENDER":
			icon = "➡️";
			message = "Rendering"
			break;
		case "API":
			icon = "📥";
			break;
		case "PRINT":
			icon = "🖨";
			break;
		case "FUNCTION_CALL":
			icon = "☎️";
			break;
		case "HOOK":
			icon = "🪝";
			break;
		default:
			icon = "📌 {{ }}";
	}


	switch (verbosity) {
		case 0:
			break;
		
		case 1:
			if(type === "RENDER"){
				console.log(icon, "[", renderingFunction, renderNumber, "]", message);
			}
			break;
		
		case 2:
			if (type === "RENDER") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message);
			}
			else if(type === "API") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message, value);
			}
			break;
		
		case 3:
			if (type === "RENDER") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message);
			}
			if(type === "API") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message, value);
			}
			if(type === "PRINT") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message, value);
				// console.table(value);
			}
			break;
		
		case 4:
			if (type === "RENDER") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message);
			}
			if(type === "API" || type === "FUNCTION_CALL") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message, value);
			}
			if (type === "PRINT") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message, value);
				// console.table(value);
			}
			break;
		
		case 5:
			if (type === "RENDER") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message);
			}
			if (type === "API" || type === "FUNCTION_CALL" || type === "HOOK") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message, value);
			}
			if (type === "PRINT") {
				console.log(icon, "[", renderingFunction, renderNumber, "]", message, value);
				// console.table(value);
			}
			break;
		
		default:
			break;
			// if (value != null) {
			// 	console.log(icon, "[", renderingFunction, renderNumber, "]", message, value);
			// }
			// else {
			// 	console.log(icon, "[", renderingFunction, renderNumber, "]", message);
			// }
			// break;
	}

}