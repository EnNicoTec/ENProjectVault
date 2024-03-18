let addSystemJournal = async ( fileFilter, entry ) => {
    
    let file = app.vault.getMarkdownFiles().find( f => f.basename.match(fileFilter));

    let fileContent = await app.vault.read(file);
    let journalEntry = "\n- " + moment().format("YYYY-MM-DD [|] HH:mm") + " => " + entry;

    await app.vault.modify(file, fileContent + journalEntry);

}

module.exports = addSystemJournal;