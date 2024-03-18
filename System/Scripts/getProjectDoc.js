/**
 * 
 * @param {*} dv DataView object
 * @param {string} projectID ID of the project for filtering
 * @param {string} docTypeString TypeString of the requested document
 * @returns The file object of the requested document
 */
function getProjectDoc ( dv, projectID, docTypeString ) {
    return dv.pages("#Project/" + projectID)
        .where( p => p.file.tags.includes("#ProjectAsset/" + docTypeString))[0];
}

module.exports = getProjectDoc;