// app.plugins.plugins["templater-obsidian"].templater.current_functions_object.user.parseSelectionsObject

function parseSelectionsObject(displayString, tag, defaultValue, getValueFunction) {
    let selection = {
        displayString: displayString,
        tag: tag,
        value: defaultValue,
        getValue: getValueFunction
    }

    return selection;
}

module.exports = parseSelectionsObject;