/** Builds an adaptive response UI for a response
 * 
 * @param {ApiAiApp} aiApp The ApiAi app instance
 * @param {String} speech the text to be read out
 * @param {String} text the text to display
 * @param {Array} suggestions a String array of suggestions
 * @param {Boolean} last true if no response is required
 */
function buildRichResponse(aiApp, speech, text, suggestions, last){
    if (aiApp.hasSurfaceCapability(aiApp.SurfaceCapabilities.SCREEN_OUTPUT)){
        aiApp.ask(aiApp.buildRichResponse()
            .addSimpleResponse(text)
            .addSuggestions(suggestions));
    } else {
        (last) ? aiApp.tell(`${speech}`, []) : aiApp.ask(`${speech}`, []);
    }
}

/**
 * This generates a random number of range, [1 - max]
 * @param {*number} max the upper boundary
 */
function generateRandomNumber(max) {
    return Math.floor(Math.random() * max);
}


module.exports.utils = {
    buildRichResponse: buildRichResponse,
    generateRandomNumber: generateRandomNumber
};