<%*
var satisfaction = 0,
	productivity = 0,
	languageEnhancement = false,
	biblestudy = false,
	sleepHours = 0;

async function scaleSelection(minNum, maxNum) {
	scale = [];
	for(i = minNum; i <= maxNum; i++){
		scale.push(i + "");
	}
	return await tp.system.suggester(scale, scale);
}

var selection = "";

var i_prevention = 0;
while (selection !== "done" && i_prevention < 30) {
	i_prevention++;
	selection = await tp.system.suggester(
		[
			(satisfaction ? "✅ Satisfaction 😊": "❌ Satisfaction 😊"),
			(productivity ? "✅ Productivity 📈": "❌ Productivity 📈"),
			(languageEnhancement ? "✅ Language Enhancement 🌎": "❌ Language Enhancement 🌎"),
			(biblestudy ? "✅ Biblestudy 📖": "❌ Biblestudy 📖"),
			(sleepHours ? "✅ Sleep Hours 💤": "❌ Sleep Hours 💤"),
			("👍 Done")
		],[
			"satisfaction",
			"productivity",
			"languageEnhancement",
			"biblestudy",
			"sleepHours",
			"done"
		]
	);

	switch(selection) {
		case "satisfaction":
			satisfaction = await scaleSelection(0, 10);
			break;
		case "productivity":
			productivity = await scaleSelection(0, 10);
			break;
		case "languageEnhancement":
			languageEnhancement = await tp.system.suggester(
				[
					"✅ Language enhanced",
					"❌ Language not enhanced"
				],[
					true,
					false
				]
			);
			break;
		case "biblestudy":
			biblestudy = await tp.system.suggester(
				[
					"✅ Studied the Bible",
					"❌ Didn't study the Bible"
				],[
					true,
					false
				]
			);
			break;
		case "sleepHours":
			sleepHours = await scaleSelection(0, 10);
			break;
		case "done":
			break;
		default:
			break;
	}
}

-%>
[Satisfaction:: <% satisfaction %>]
[Productivity:: <% productivity %>]
[LanguageEnhancement:: <% languageEnhancement %>]
[Biblestudy:: <% biblestudy %>]
[SleepHours:: <% sleepHours %>]
