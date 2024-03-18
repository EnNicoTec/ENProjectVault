<%*

const projectPauseTag = "#ProjectOnHold";
const pauseTagFilter = /^\ \ \-\ ("|"#){0,1}ProjectOnHold("){0,1}(\r\n|\r|\n)/gm;
const tagsHeaderFilter = /^tags\:(\ ){0,1}(\r\n|\r|\n)/gm;

const dv = app.plugins.plugins['dataview'].api;

let projectID = tp.frontmatter.projectid;
let tasksFile = tp.user.getProjectDoc(dv, projectID, "Tasks");

if(tasksFile.file.tags.includes(projectPauseTag)) {
	tp.user.replaceFileContent("Tasks " + projectID, pauseTagFilter, "");
} else {
	tp.user.replaceFileContent("Tasks " + projectID,
		tagsHeaderFilter,
		"tags:\n  - \"" + projectPauseTag + "\"\n"
	);
}

-%>