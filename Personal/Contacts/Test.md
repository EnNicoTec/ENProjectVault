---
type: contact
name:
  first: Max
  last: Mustermann
  short: Test
email: max@mustermann.com
phone: ""
birthday: 2000-01-01
projects:
  - project-management
---
# Test


## Details

- Name : `$= dv.current().name.first + " " + dv.current().name.last`
- Contact Methods:
	- E-Mail : `$= dv.current().email`
	- Phone : `$= dv.current().phone`
- Birthday : `$= dv.current().birthday`

