// const dv = app.plugins.plugins['dataview'].api;
let getLatestProjectID = ( dv ) => {

    /*
    let projectFile = JSON.parse(JSON.stringify(dv.pages("#Project")))
        .values.sort( (a, b) => {
            return moment(b.file.ctime).diff(moment(a.file.ctime));
    })[0];
    */

    let projectFile = dv.pages("#Project").sort( p => p.file.ctime, 'desc' ).first();
    let projectID = projectFile.projectid;
    console.log("Fetched ProjectID '" + projectID + "' from '" + projectFile.file.name + "'");

    return projectID;
}

module.exports = getLatestProjectID;