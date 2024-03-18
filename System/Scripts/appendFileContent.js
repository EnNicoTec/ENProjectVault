let replaceFileContent = async ( fileName, appendix ) => {

    let file = app.vault.getMarkdownFiles().find( f => f.basename === fileName);

    let fileContent = await app.vault.read(file);
    fileContent += appendix;

    await app.vault.modify(file, fileContent);

}

module.exports = replaceFileContent;