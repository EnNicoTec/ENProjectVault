let replaceFileContent = async ( fileName, filter, replaceString ) => {

    let file = app.vault.getMarkdownFiles().find( f => f.basename === fileName);
    let fileContent = await app.vault.read(file);
    fileContent = fileContent.replace(filter, replaceString);

    console.log("Editing file: " + file.basename);
    console.log(fileContent);
    console.log(fileContent.match(filter));
    await app.vault.modify(file, fileContent);

}

module.exports = replaceFileContent;