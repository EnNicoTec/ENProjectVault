<%*

// Create Notes file
console.log("Setup: Initialize Project Notes...");
await tp.file.create_new(
	tp.file.find_tfile("New Project Notes"),
	"Unspecified",
	false
);
console.log("Setup: Notes file initialized!");

// Create Tasks file
console.log("Setup: Initialize Project Tasks...");
await tp.file.create_new(
	tp.file.find_tfile("New Project Tasks"),
	"Unspecified",
	false
);
console.log("Setup: Tasks file initialized");

// Create Journal file
console.log("Setup: Initialize Project Journal...");
await tp.file.create_new(
	tp.file.find_tfile("New Project Journal"),
	"Unspecified",
	false
);
console.log("Setup: Journal file initialized");

// Create Overview file
console.log("Setup: Initialize Project Overview...");
await tp.file.create_new(
	tp.file.find_tfile("New Project Overview"),
	"Unspecified",
	true
);
console.log("Setup: Overview file initialized");

-%>