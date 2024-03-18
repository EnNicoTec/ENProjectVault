---
type: Overview
---
# Projects Overview

```button
name Create new Project
type command
action Templater: Insert System/Templates/Func-ProjectSetup.md
color blue
```
^button-createproject


## ⏩ Progress

```dataviewjs
const factor_inProgress = 0.3;
const factor_onHold = 0.3;
const factor_review = 0.7;
const factor_done = 1;
const chartAspectRatio = 4; // (Width / Height)
const barSizePercentage = 1;
const projectPauseTag = "#ProjectOnHold";
const projectPauseColor = {
	red: "50",
	green: "50",
	blue: "50"
}

// Import templater user scripts
const {
		round
	} = app.plugins.plugins["templater-obsidian"].templater.current_functions_object.user;

const projectIDs = dv.pages("#ProjectAsset/Tasks")
	.sort( p => p.date, 'desc' )
	.sort( p => p.file.tags.includes(projectPauseTag) )
	.map( p => p.projectid );
// Get the Task file associated with this project
const taskDocs = projectIDs.map( id =>
	dv.pages("#ProjectAsset/Tasks").find( p => p.projectid === id )
);

// Calculate how much % of tasks from a certain status are completed
let getStatusCompletionRate = ( doc, status ) => {
	let tCount = doc.file.tasks.length;
	return doc.file.tasks
		.where( t => String(t.section).includes(status) )
		.length / tCount;
}

let inProgress_completionRates = taskDocs.map( d => 
	getStatusCompletionRate( d, "In Progress" ) * factor_inProgress
);
let onHold_completionRates = taskDocs.map( d => 
	getStatusCompletionRate( d, "On Hold" ) * factor_onHold
);
let review_completionRates = taskDocs.map( d => 
	getStatusCompletionRate( d, "Review" ) * factor_review
);
let done_completionRates = taskDocs.map( d => 
	getStatusCompletionRate( d, "Done" ) * factor_done
);

// Calculate overall completion rate
let completionRates = projectIDs.map( (value, index) =>
	round(
		inProgress_completionRates[index]
		+ onHold_completionRates[index]
		+ review_completionRates[index]
		+ done_completionRates[index]
	, 4)
);

// Calculate the bar color according to the completion rate:
// 0% = red : 1; green : 0
// 100% = red : 0; green : 1
let redValues = [];
let greenValues = [];
let blueValues = [];
projectIDs.forEach( (id, i) => {
	if(taskDocs[i].file.tags.includes(projectPauseTag)) {
		redValues.push(projectPauseColor.red);
		greenValues.push(projectPauseColor.green);
		blueValues.push(projectPauseColor.blue);
		return;
	}
	
	redValues.push(
		String(Math.min(round((1 - completionRates[i]) * 100, 0), 99))
			.padStart(2, '0'));
	greenValues.push(
		String(Math.min(round(completionRates[i] * 100, 0), 99))
			.padStart(2, '0'));
	blueValues.push("00");
});

let barColors = projectIDs.map( (value, index) => ("#" + redValues[index] + greenValues[index] + blueValues[index] + "ff") );

let chartConfig = {
	data: {
        labels: projectIDs.map((id, index)=>
	        (completionRates[index] == 1 ? "✅ " + id : id)),
        datasets: [{
	        type: 'bar',
            label: 'Completion Rate',
            data: [...completionRates].map( c => c * 100),
            backgroundColor: barColors
        }]
    },
	options: {
		//aspectRatio: chartAspectRatio,
		indexAxis: 'y',
		scales: {
			x: {
				min: 0,
				max: 100
			}
		},
		barPercentage: barSizePercentage,
		plugins: {
			legend: {
				display: false
			},
			tooltips: {
				enabled: false
			}
		}
	}
}

window.renderChart(chartConfig, this.container);
```


## 📊 Stats

```dataviewjs
const projectPauseTag = "#ProjectOnHold"

const projectIDs = dv.pages("#ProjectAsset/Tasks")
	.sort( p => p.date, 'desc')
	.sort( p => p.file.tags.includes(projectPauseTag) )
	.map( p => p.projectid );

const tasksDocs = projectIDs.map( id =>
	dv.pages("#ProjectAsset/Tasks").find( p => p.projectid === id )
);
const overviewDocs = projectIDs.map( id =>
	dv.pages("#ProjectAsset/Overview").find( p => p.projectid === id )
);
const contributors = projectIDs.map( id =>
	dv.pages().where(p=>p.type === "contact")
		.where(c => c.projects.includes(id))
);

dv.table(["Project", "☑️ | 🔴 | ✅", "👨 Contributors"],
	tasksDocs.map( (p, i) => [
		dv.fileLink(overviewDocs[i].file.path, false,
			(p.file.tasks.where(t=>!t.completed).length == 0 ? "✅ " : 
				(p.file.tags.includes(projectPauseTag) ? "⏸️ " : "")
			) + p.projectid),
		dv.fileLink(p.file.path, false,
			p.file.tasks.where(t=>!t.completed).length
			+ " | "
			+ p.file.tasks.where(t=>
				t.text.contains("#Priority/High") && !t.completed
			).length
			+ " | "
			+ p.file.tasks.where(t=>t.completed).length
		),
		contributors[i].map(c=> "[[" + c.file.name + "|" + c.name.short + "]]")
			.toString().replace(/(^\[|\]$)/gm, "")
	])
);

```

- ☑️ => Incomplete
- 🔴 => Incomplete and Critical
- ✅ => Done
- ⏸️ => Project on hold


```button
name Load Data
type command
action Templater: Insert System/Templates/New Empty.md
```
^button-auxj