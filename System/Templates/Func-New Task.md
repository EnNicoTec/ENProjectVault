<%*

let taskSectionMatch = /^## .{1,2} New(\r\n|\n|\r)\1/gm;

const {
	parseSelectionsObject,
	getSelectionsUI
} = tp.user;

let rangeArray = ( min, max ) => {
	return Array.from(Array(max - min + 1), (e,i)=>i+min);
}

let selections = {};

selections["description"] = parseSelectionsObject("Task", "description", null, async ( option ) => {
	return await tp.system.prompt("The Task is", option.value);
});

selections["priority"] = parseSelectionsObject("Priority", "priority", "Normal", async ( option ) => {
	return (await tp.system.suggester(
		[
			"High",
			"Normal",
			"Low"
		].map( p => 
			p === option.value ? "-> " + p : p
		),[
			"High",
			"Normal",
			"Low"
		]
	));
});
selections["due"] = parseSelectionsObject("Due Date", "due", tp.date.now("YYYY-MM-DD"), async ( option ) => {
	let minYear = moment().subtract(1, 'year').year();
	let maxYear =  moment().add(5, 'years').year();
	
	let dueYear = await tp.system.suggester(
		rangeArray(minYear, maxYear)
			.map( y => moment(option.value, "YYYY-MM-DD").format("YYYY") == y ? "-> " + y : y),
		rangeArray(minYear, maxYear)
	);
	
	let dueMonth = await tp.system.suggester(
		[
			"01 | January",
			"02 | February",
			"03 | March",
			"04 | April",
			"05 | May",
			"06 | June",
			"07 | July",
			"08 | August",
			"09 | September",
			"10 | October",
			"11 | November",
			"12 | December"
		].map( y => String(y).includes(
					moment(option.value, "YYYY-MM-DD").format("MM")
				) ? "-> " + y : y
		),[
			1,2,3,4,5,6,7,8,9,10,11,12
		]
	);
	dueMonth = String(dueMonth).padStart(2, '0');
	
	let monthDays = moment(dueYear + "-" + dueMonth, "YYYY-MM").endOf("month").format("DD");
	let dueDay = await tp.system.suggester(
		rangeArray(1, monthDays)
			.map( y => {
				let weekDay = moment(dueYear + "-" + dueMonth + "-" + y).format("dddd");
				return String(y).padStart(2, '0') + " | " + weekDay;
			})
			.map( y => y.includes(moment(option.value, "YYYY-MM-DD").format("DD")) ? "-> " + y : y)
		, rangeArray(1, monthDays)
	);
	
	let dueDate = dueYear + "-" + dueMonth + "-" + dueDay;
	return dueDate;
});

selections["assignee"] = parseSelectionsObject("Assignee", "assignee", "me", async ( option ) => {
	const dv = app.plugins.plugins['dataview'].api;
	let contacts = dv.pages().where(p => p.type === "contact")
		.where( p =>{
			if(p.projects) {
				console.log(p.projects);
				return p.projects.includes(tp.frontmatter.projectid);
			}
		});
	return await tp.system.suggester(
		contacts.map( c => c.name.short ),
		contacts.map( c => c.file.name )
	)
});

selections["milestone"] = parseSelectionsObject("Milestone", "milestone", false, async ( option ) => {
	return (await tp.system.suggester(
		[
			"Is Milestone",
			"Is not a Milestone"
		],[
			true,
			false
		]
	));
});

let task = await getSelectionsUI( tp, selections );

let taskFile = tp.file.find_tfile("Tasks " + tp.frontmatter.projectid);
let taskFileContent = await tp.file.include(taskFile);

let taskEntryPoint = taskFileContent.match(taskSectionMatch)[0];
taskFileContent = taskFileContent.replace(taskEntryPoint, 
	taskEntryPoint
	+ "- [ ] " + task.description
	+ "<br>#Priority/" + task.priority + " "
	+ (task.milestone ? "<br>#Milestone " : "")
	+ "<br>@{[due:: " + task.due + "]}"
	+ "<br>[assignee:: [[" + task.assignee + "]]]"
	+ "\n"
);

await app.vault.modify(taskFile, taskFileContent);

await tp.user.addSystemJournal("Journal " + tp.frontmatter.projectid,
	"Task added: " + task.description
);

-%>