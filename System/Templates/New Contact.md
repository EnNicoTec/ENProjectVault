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

