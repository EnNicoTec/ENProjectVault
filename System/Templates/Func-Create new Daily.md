<%*
let dailyPath = "Personal/Journal",
	today = tp.date.now("YYYY-MM-DD");
if(!(await tp.file.exists(today))) {
	tp.file.create_new(tp.file.find_tfile("New Daily"), "Unavailable", true, app.vault.getAbstractFileByPath(dailyPath))
}
-%>
