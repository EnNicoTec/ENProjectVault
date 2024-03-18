<%*

let projectID = tp.frontmatter.projectid;

const dv = app.plugins.plugins['dataview'].api;
let contacts = dv.pages().where(p => p.type === "contact")
	.where( p =>{
		if(!p.projects)
			return p;
		else
			return !p.projects.includes(projectID);
	});

let collaborator = await tp.system.suggester(
	contacts.map( c => c.name.short),
	contacts
);
if(!collaborator)
	return;
console.log(collaborator);
await tp.user.replaceFileContent(
	collaborator.file.name,
	/^projects\:( ){0,1}(\[|\]){0,2}/gm,
	"\nprojects:\n  - " + projectID
);

await tp.user.addSystemJournal("Journal " + tp.frontmatter.projectid,
	"Contributor added to the project: " + collaborator.file.link
);

-%>