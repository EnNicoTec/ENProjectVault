<%*

let getSuggesterUI = async () => {
	// Returns a hashmap of selected values
	// Add new options using the 'newOption' function

	let selections = new Map();
	function newOption(displayString, tag, getValueFunction) {
		selections[tag] = {
			displayString: displayString,
			tag: tag,
			value: null,
			getValue: getValueFunction
		}
	}
	
	// ADD NEW OPTIONS HERE
	
	newOption("Test 3", "test3", async ( option ) => {
		return await tp.system.prompt("Test 3 ist?");
	});
	newOption("Test 4", "test4", async ( option ) => {
		return await tp.system.prompt("Test 4 ist?");
	});
	
	////////////////////////////////////
	
	let cursor = "next";
	let counter = 0;
	let infLoopPreventionLimit = 100;
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
			// console.log(selections[cursor].tag + ": " + selections[cursor].value);
		}
	}

	let returnMap = new Map();
	Object.values(selections).forEach( s => {
		returnMap[s.tag] = s.value;
	});
	return returnMap;
}

-%>

