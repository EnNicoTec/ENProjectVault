<%*

let contactDir = "Personal/Contacts";

let contact = {
	nickname: await tp.system.prompt("Nickname"),
	name: {
		first: await tp.system.prompt("First Name"),
		last: await tp.system.prompt("Last Name")
	},
	email: await tp.system.prompt("E-Mail"),
	phone: await tp.system.prompt("Phone Number"),
	birthday: await tp.system.prompt("Birthday (YYYY-MM-DD)")
}

await tp.file.move(contactDir + "/" + contact.nickname);

-%>
---
type: contact
name:
  first: "<% contact.name.first %>"
  last: "<% contact.name.last %>"
  short: "<% contact.nickname %>"
email: "<% contact.email %>"
phone: "<% contact.phone %>"
birthday: <% contact.birthday %>
projects: 
---
# <% contact.nickname %>


## Details

- Name : `$= dv.current().name.first + " " + dv.current().name.last`
- Contact Methods:
	- E-Mail : `$= dv.current().email`
	- Phone : `$= dv.current().phone`
- Birthday : `$= dv.current().birthday`


## Projects

### Active Projects

```dataviewjs
let myProjects = [];

dv.pages("#ProjectAsset/Tasks").sort(p=> p.date, 'desc').forEach(p=> {
	dv.current().projects.forEach(id=>{
		if(p.projectid === id) {
			if(p.file.tasks
				.where( t =>
					t.assignee.path === dv.current().file.path
					&& !t.completed
				).length > 0)
				myProjects.push({
					id: id,
					date: p.date,
					tasks: p.file.tasks.where( t =>
						t.assignee.path === dv.current().file.path),
					docs: {
						tasks: p
					}
				})
		}
	})
});

dv.pages("#ProjectAsset/Overview").forEach(p=>{
	myProjects.forEach( (project, i) =>{
		if(project.id === p.projectid)
			myProjects[i].docs['overview'] = p;
	})
});

dv.table(["Project", "☑️ | 🔴 | ✅"],
	myProjects.map( p => [
		dv.fileLink(p.docs.overview.file.path, false, p.id),
		dv.fileLink(p.docs.tasks.file.path, false,
			p.tasks.where(t=> !t.completed).length
			+ " | "
			+ p.tasks.where(t=>
				t.text.includes("#Priority/High")
				&& !t.completed
			).length
			+ " | "
			+ p.tasks.where(t=> t.completed).length
		)
	])
);
```


### Completed Projects

```dataviewjs
let myProjects = [];

dv.pages("#ProjectAsset/Tasks").sort(p=> p.date, 'desc').forEach(p=> {
	dv.current().projects.forEach(id=>{
		if(p.projectid === id) {
		
			// Only include completed projects
			if(p.file.tasks
				.where( t =>
					t.assignee.path === dv.current().file.path
					&& !t.completed
				).length < 1) {
				
				myProjects.push({
					id: id,
					date: p.date,
					tasks: p.file.tasks.where( t =>
						t.assignee.path === dv.current().file.path),
					docs: {
						tasks: p
					}
				})
			}
		}
	})
});

dv.pages("#ProjectAsset/Overview").forEach(p=>{
	myProjects.forEach( (project, i) =>{
		if(project.id === p.projectid)
			myProjects[i].docs['overview'] = p;
	})
});

dv.table(["Project", "✅ Tasks"],
	myProjects.map( p => [
		dv.fileLink(p.docs.overview.file.path, false, p.id),
		dv.fileLink(p.docs.tasks.file.path, false,
			p.tasks.where(t=> t.completed).length
		)
	])
);
```

