---
type: contact
name:
  first: "Tim"
  last: "Tailor"
  short: "Test2"
email: "tim@tailor"
phone: "1324"
birthday: 1955-12-31

projects:
  - SampleProject
---
# Test2


## Details

- Name : `$= dv.current().name.first + " " + dv.current().name.last`
- Contact Methods:
	- E-Mail : `$= dv.current().email`
	- Phone : `$= dv.current().phone`
- Birthday : `$= dv.current().birthday`

