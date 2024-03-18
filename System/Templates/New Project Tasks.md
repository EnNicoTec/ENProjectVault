<%*

let projectAsset = "Tasks";

const dv = app.plugins.plugins['dataview'].api;
let projectID = tp.user.getLatestProjectID(dv);

let fileName = projectAsset + " " + projectID;
let folderPath = "/Projects/" + projectID;
console.log("Moving file to: " + folderPath + "/" + fileName);
await tp.file.move(folderPath + "/" + fileName);

-%>
---

kanban-plugin: basic
tags:
  - Project/<% projectID %>
  - ProjectAsset/Tasks
type: project-tasklist
projectid: <% projectID %>
date: <% tp.date.now("YYYY-MM-DD") %>

---

## ✨ New



## 🏃‍♂️ In Progress

- [ ] Initialize project '<% projectID %>'<br>#Priority/High <br>#Milestone <br>@{[due:: <% tp.date.now("YYYY-MM-DD") %>]}<br>[assignee:: [[me]]]


## ⏸️ On Hold



## 🔎 Review



## ✅ Done

**Complete**




%% kanban:settings
```
{"kanban-plugin":"basic"}
```
%%