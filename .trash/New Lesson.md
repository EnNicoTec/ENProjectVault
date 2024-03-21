<%*
let sClass = "12IS21"
let subject = ""
let selection = ""

let i = 0
while(selection !== "done" && i < 20){
	i++

	selection = await tp.system.suggester(
		[
		(sClass ? "✅ Klasse" : "❌ Klasse"),
		(subject ? "✅ Fach" : "❌ Fach"),
		"👍 Weiter"
		],[
		"sClass",
		"subject",
		"done"
		]
	)
	
	switch (selection){
		case "sClass":
			sClass = await tp.system.prompt("Klasse", sClass)
			break;
		case "subject":
			subject = await tp.system.prompt("Fach", subject)
			break;
		default:
			break;
	}

}

let titleName = tp.date.now("YYYY-MM-DD") + " " + subject

await tp.file.rename(titleName)
await tp.file.move("/School/" + titleName)
-%>
---
type: Lesson
class: <% sClass %>
subject: <% subject %>
date: <% tp.date.now("YYYY-MM-DD") %>

---
# <% tp.date.now("YYYY-MM-DD") %> <% subject %>

[[<% tp.date.now("YYYY-MM-DD", -7) %> <% subject %> |<< Letzte Stunde]] | [[<% tp.date.now("YYYY-MM-DD", 7) %> <% subject %> |Nächste Stunde >>]]

<% tp.file.cursor() %>


---
---
[[<% tp.date.now("YYYY-MM-DD", -7) %> <% subject %> |<< Letzte Stunde]] | [[<% tp.date.now("YYYY-MM-DD", 7) %> <% subject %> |Nächste Stunde >>]]