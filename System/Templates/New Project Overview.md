<%*

let projectAsset = "Overview";

const dv = app.plugins.plugins['dataview'].api;
let projectID = tp.user.getLatestProjectID(dv);

await tp.user.replaceFileContent(
	"me",
	/^projects\:( ){0,1}(\[|\]){0,2}/gm,
	"projects: \n  - " + projectID
);

let fileName = projectAsset + " " + projectID;
let folderPath = "/Projects/" + projectID;
console.log("Moving file to: " + folderPath + "/" + fileName);
await tp.file.move(folderPath + "/" + fileName);

-%>
---
type: Overview
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - ProjectAsset/Overview
  - Project/<% projectID %>
projectid: <% projectID %>
---
# <% projectID %> | Overview
<% tp.file.cursor() %>

## ⏩ Progress

```dataviewjs
const projectPauseTag = "#ProjectOnHold";
const pauseButton = "`button-projectpause`";
const resumeButton = "`button-projectresume`";

let projectID = dv.current().projectid;
let tasksFile = dv.pages("#Project/" + projectID + " and #ProjectAsset/Tasks").first();

let renderSpan = "";
if(tasksFile.file.tags.includes(projectPauseTag))
	renderSpan = resumeButton;
else
	renderSpan = pauseButton;

dv.span(renderSpan);
```

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
		getProjectDoc,
		round
	} = app.plugins.plugins["templater-obsidian"].templater.current_functions_object.user;

const projectID = dv.current().projectid;
// Get the Task file associated with this project
const taskDoc = getProjectDoc(dv, projectID, "Tasks");

// Calculate how much % of tasks from a certain status are completed
let getStatusCompletionRate = ( doc, status ) => {
	let tCount = doc.file.tasks.length;
	return doc.file.tasks
		.where( t => String(t.section).includes(status) )
		.length / tCount;
}

let inProgress_completionRate = getStatusCompletionRate( taskDoc, "In Progress" ) * factor_inProgress;
let onHold_completionRate = getStatusCompletionRate( taskDoc, "On Hold" ) * factor_onHold;
let review_completionRate = getStatusCompletionRate( taskDoc, "Review" ) * factor_review;
let done_completionRate = getStatusCompletionRate( taskDoc, "Done" ) * factor_done;

// Calculate overall completion rate
let completionRate = inProgress_completionRate
	+ onHold_completionRate
	+ review_completionRate
	+ done_completionRate;
completionRate = round(completionRate, 4);

// Calculate the bar color according to the completion rate:
// 0% = red : 1; green : 0
// 100% = red : 0; green : 1
let redValue;
let greenValue;
let blueValue;
if(taskDoc.file.tags.includes(projectPauseTag)) {
	redValue = projectPauseColor.red;
	greenValue = projectPauseColor.green;
	blueValue = projectPauseColor.blue;
} else {
	redValue = String(
		Math.min(round((1 - completionRate) * 100, 0), 99)
	).padStart(2, '0');
	greenValue = String(
		Math.min(round(completionRate * 100, 0), 99)
	).padStart(2, '0');
	blueValue = "00";
}

let barColor = ("#" + redValue + greenValue + blueValue + "ff");

let chartConfig = {
	type: 'bar',
	data: {
		labels: [round(completionRate * 100, 0) + " %"],
		datasets: [{
			label: "Completion Rate",
			data: [completionRate * 100],
			backgroundColor: barColor
		}]
	},
	options: {
		aspectRatio: chartAspectRatio,
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


```button
name Add new Task
type command
action Templater: Insert System/Templates/Func-New Task.md
color green
```
^button-newprojecttask

```dataviewjs
let projectID = dv.current().projectid;
let pagesFilter = "#ProjectAsset/Tasks and #Project/" + projectID;
let tasksPage = dv.pages(pagesFilter)[0];

dv.list([
	dv.fileLink(tasksPage.file.path, false, "📋 Task-Board")
]);
```


## 🔔 Due Soon!

```dataviewjs
let dueLimit = 5 // How many days in advance should be included

// Import templater user scripts
const {
		getProjectDoc
	} = app.plugins.plugins["templater-obsidian"].templater.current_functions_object.user;

const projectID = dv.current().projectid;
// Fetch all tasks of associated Tasks file
const tasks = getProjectDoc(dv, projectID, "Tasks").file.tasks;

dv.table( ["📋 Task", "📅 Due < " + dueLimit + " days", "🔆 Status"] ,
			tasks
				.where( t => !t.completed)
				// Filter according to dueLimit
				.where( t => {
					if(!t.due) return false;
					let today = moment(Date.now());
					let taskDue = moment(String(t.due));
					
					return taskDue.diff(today, 'days') < dueLimit;
				})
				// Sort by priority first, then by due date
				.sort( t => {
					let priority = 0;
					
					priority += t.text.contains("#Priority/High") ? 10 :
					t.text.contains("#Priority/Low") ? 30 :
					20;
					return priority;
				})
				.sort( t => t.due)
				.map( t => [
				
					// Task Column
					(() => {
						let taskName = t.text.split("<br>")[0];
						let taskPriority = "🟡";
						if(!t.text.includes("#Priority")){
							return taskPriority + " " + taskName;
						}
						
						let priority = t.text
							.split("#Priority/")[1]
							.split(" <br>")[0];
							
						if(priority === "High")
							taskPriority = "🔴";
						else if(priority === "Normal")
							taskPriority = "🟡";
						else taskPriority = "🟢";
						
						return taskPriority + " **" + taskName + "**";
					})(),
					
					// Due column
					( () => {
						let taskDate = moment(String(t.due));
						return (taskDate.diff(moment(Date.now()), 'days') < 0)
							? "❗ " + taskDate.format("DD MMMM YYYY")	
							: t.due
					})(),
					
					// Status column
					String(t.section).split("> ")[1].split("]]")[0]
				])
		)

```


## 🚩 Milestones

```dataviewjs
const {
		getProjectDoc
	} = app.plugins.plugins["templater-obsidian"].templater.current_functions_object.user;

let projectID = dv.current().projectid;
let tasks = getProjectDoc( dv, projectID, "Tasks" ).file.tasks;

dv.table( ["📋 Task", "🔆 Status", "👨 Assignee"] ,
	tasks.where( t => t.text.includes("#Milestone"))
		.map( t => [
			(t.completed ? "✅ " : "☑️ ") + t.text.split("<br>")[0],
			String(t.section).split("> ")[1].split("]]")[0],
			t.assignee
		])
);
```


## 🔆 Status Overview

```dataviewjs
const {
		getProjectDoc
	} = app.plugins.plugins["templater-obsidian"].templater.current_functions_object.user;

let projectID = dv.current().projectid;
let tasks = getProjectDoc( dv, projectID, "Tasks").file.tasks;

dv.table(["Status", "Task-Count"],
	tasks
		.groupBy(t => t.section)
		// Custom sort by section
		.sort(t => String(t.key).includes("New") ? 1 :
			String(t.key).includes("In Progress") ? 2 :
			String(t.key).includes("On Hold") ? 3 :
			String(t.key).includes("Review") ? 4 :
			String(t.key).includes("Done") ? 5 :
			6)
		.map(t => [
			// Extract section string
			String(t.key).split("> ")[1].split("]]")[0],
			t.rows.length
		])
);
```


---

## 🙌 Collaboration

```dataviewjs
const {
		getProjectID,
		getProjectDoc
	} = app.plugins.plugins["templater-obsidian"].templater.current_functions_object.user;

let projectID = dv.current().projectid;
// Get all tasks from the Tasks file associated with this project
let tasks = getProjectDoc( dv, projectID, "Tasks" ).file.tasks;
// Get all contacts associated with this project
let assignees = dv.pages().where( p => {
	if(p.type !== "contact" || !p.projects)
		return false;
	
	return p.projects.includes(projectID)
});

dv.table( ["👨 Contributor", "📋 Open Tasks", "🔴 Critical Tasks", "✅ Finished"] ,
	assignees.map( a => [
	
		// Contributor column
		a.file.link,
		
		// Open tasks
		tasks.where( t => a.file.path === t.assignee.path && !t.completed ).length,
		
		// #Priority/High tasks
		tasks.where( t =>
			a.file.path === t.assignee.path
			&& !t.completed
			&& t.text.includes("#Priority/High")
		).length,
		
		// Completed tasks
		tasks.where( t => a.file.path === t.assignee.path && t.completed ).length
	])	
);
```

```button
name Add Contributor
type command
action Templater: Insert System/Templates/Func-ProjectAddContributor.md
color yellow
```
^button-addcontributor

```button
name Create Contact
type command
action Templater: Insert System/Templates/Func-Create new Contact.md
color blue
```
^button-createcontact

---

## 📂 Project-Files

```dataviewjs
let linkExclusions = [
	"![[",
	"Personal/Contacts/"
];

let projectID = dv.current().projectid;

dv.table( ["📓 Document", "🔗 Links"],
		dv.pages("#Project/" + projectID)
			.map( p => [
				dv.fileLink(
					p.file.path,
					false,
					p.file.name.replace(projectID, "")),
				p.file.outlinks
					.where( l => !linkExclusions.some( e => !String(l).includes(e)))
			])
	)
```



```button
name Load Data
type command
action Templater: Insert System/Templates/New Empty.md
color purple
```
^button-loadtemplater
