/** Builds an adaptive response UI for a response
 * 
 * @param {ApiAiApp} aiApp The ApiAi app instance
 * @param {String} speech the text to be read out
 * @param {String} text the text to display
 * @param {Array} suggestions a String array of suggestions
 */
function buildRichResponse(aiApp, speech, text, suggestions){
    if (aiApp.hasSurfaceCapability(aiApp.SurfaceCapabilities.SCREEN_OUTPUT)){
        aiApp.ask(aiApp.buildRichResponse()
            .addSimpleResponse(text)
            .addSuggestions(suggestions));
    } else {
        aiApp.ask(`${speech}`, []);
    }
}

/** Builds an adaptive response UI for a response
 * 
 * This is not the best way to end a conversation. I opted for this
 * method to avoid a heavy refactoring.
 * 
 * @param {ApiAiApp} aiApp The ApiAi app instance
 * @param {String} speech the text to be read out
 */
function buildLastResponse(aiApp, speech){
   return aiApp.buildResponse_(speech, false);
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
    buildLastResponse: buildLastResponse,
    generateRandomNumber: generateRandomNumber
};