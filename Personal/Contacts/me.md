---
type: contact
name:
  first: Nico
  last: Engelbarts
  short: Nico
phone: +49 123456789
birthday: 2001-01-01
projects:
  - SampleProject
email: tec.ennico@gmail.com
---
# Nico Engelbarts


## Details

- Name : `$= dv.current().name.first + " " + dv.current().name.last`
- Contact Methods:
	- E-Mail : `$= dv.current().email`
	- Phone : `$= dv.current().phone`
- Birthday : `$= dv.current().birthday`
