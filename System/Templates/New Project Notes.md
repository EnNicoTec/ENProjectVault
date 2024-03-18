<%*

let projectAsset = "Notes";

let projectIDExceptions = [
	"Overview",
	"Task",
	"Tasks",
	"Notes",
	"Journal",
	"Assets"
];

let projectID = "";
do {
	projectID = await tp.system.prompt("Project ID");
	console.log("ProjectID: " + projectID);
} while (projectIDExceptions.includes(projectID));

let fileName = projectAsset + " " + projectID;
let folderPath = "/Projects/" + projectID;
console.log("Moving file to: " + folderPath + "/" + fileName);
await tp.file.move(folderPath + "/" + fileName);

-%>
---
type: project-notes
tags:
  - Project/<% projectID %>
  - ProjectAsset/Notes
projectid: <% projectID %>
---
# <% projectID %> | Notes



