<%*

let projectAsset = "Journal";

const dv = app.plugins.plugins['dataview'].api;
let projectID = tp.user.getLatestProjectID(dv);

let fileName = projectAsset + " " + projectID;
let folderPath = "/Projects/" + projectID;
console.log("Moving file to: " + folderPath + "/" + fileName);
await tp.file.move(folderPath + "/" + fileName);

-%>
---
type: project-journal
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - Project/<% projectID %>
  - ProjectAsset/Journal
projectid: <% projectID %>
---
# <% projectID %> | Journal

## <% tp.date.now("YYYY-MM-DD") %>

- Project initialized!



---

# System-Journal

- <% tp.date.now("YYYY-MM-DD [|] HH:mm") %> => Project '<% projectID %>' initialized!