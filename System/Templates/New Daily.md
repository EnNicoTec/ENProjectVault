<%*
// Daily notes location
let dailyPath = "Personal/Journal/";

// Retrieve all current daily notes
let files = app.vault.getMarkdownFiles();
let dailyNotes = new Array();
files.forEach((file) => {
	if (file.path.includes(dailyPath)) {
		dailyNotes.push(file.basename);
	}
})

// Find latest Daily note
dailyNotes.sort().reverse();
let lastDaily = null;
if(dailyNotes[0].includes(tp.file.title)) {
	lastDaily = tp.file.find_tfile(dailyNotes[1]);
} else {
	lastDaily = tp.file.find_tfile(dailyNotes[0]);
}

// Read content of last Daily
let lastContent = await app.vault.read(lastDaily);

// Move Daily note to location
titleName = tp.date.now("YYYY-MM-DD");
await tp.file.rename(titleName);
await tp.file.move(dailyPath + titleName);

// Insert Link to this note in the last Daily
await app.vault.modify(lastDaily, lastContent.replaceAll("[[|Next Day >>]]", "[[" + titleName + "|Next Day >>]]"));
-%>
---
type: Daily Note
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - daily
---
# <% tp.date.now("Do MMMM[,] YYYY [(]dddd[)]") %>
---

[[<% lastDaily.path %>|<< Previous Day]] | `= join(list("[[", dateformat(date(today), "yyyy-MM-dd"), "|", "Today", "]]"), "")` | [[|Next Day >>]]

---

# Open Tasks

```dataviewjs
dv.taskList(dv.pages("#daily").file.tasks
			.where(t => !t.completed)
		   );
```

---


# Journal


<% tp.file.cursor() %>



---


# Daily Conclusion

```button
name Daily Conclusion
type command
action Templater: Insert Templates/Func-Daily Stats.md
```
^button-nnqu



---
[[<% lastDaily.path %>|<< Previous Day]] | `= join(list("[[", dateformat(date(today), "yyyy-MM-dd"), "|", "Today", "]]"), "")` | [[|Next Day >>]]
