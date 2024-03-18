// app.plugins.plugins["templater-obsidian"].templater.current_functions_object.user.getSelectionsUI;

let getSelectionsUI = async ( tp, selections ) => {
	let infLoopPreventionLimit = 20;

	let cursor = "next";
	let counter = 0;
	while(cursor !== "done" && counter < infLoopPreventionLimit) {
		counter++;
		cursor = await tp.system.suggester(
			Object.values(selections).map( s => {
				return s.displayString;
			}).concat("Done"),
			Object.values(selections).map( s => {
				return s.tag;
			}).concat("done")
		);
		if(cursor !== "done") {
			selections[cursor].value = await selections[cursor].getValue(selections[cursor]);
		}
	}

	let returnMap = new Map();
	Object.values(selections).forEach( s => {
		returnMap[s.tag] = s.value;
	});
	return returnMap;
}

module.exports = getSelectionsUI;