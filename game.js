/**
 * This file handles the game portion of the app
 * There are only two start operations which are Addition and Multiplication.
 * The game was kept as simple as possible but can be extended for greater complexities.
 * 
 * It is important to note that question counter start from 1 and not 0.
 */

const util = require('./util');
const apiAi = require('actions-on-google').ApiAiApp;

// Contexts and Lifespans
const CONTEXT_PLAY_GAME = "play_game";
const CONTEXT_PLAY_AGAIN = "play_game_again_followup";
const DEFAULT_LIFESPAN = 5;
const END_LIFESPAN = 0;

// The different start operations available
const ADD_OP = 'add';
const MULTIPLY_OP = 'multiply';
// The total number of questions to be asked
const NUM_QUESTIONS = 5;

const COUNTER = 'counter';
const ADD_RESULT = 'add_result';
const MULTIPLY_RESULT = 'multiply_result';
const START_OP = 'start_op';

// Iniatializing game replies
const BEGIN_GAME_RES = [
    'Sure!, I\'m in. Choose a secret number',
    'Play a game? Okay! Choose a secret number',
    'Alright. Go ahead and choose a secret number'
];

// Game restart replies
const RESTART_GAME_RES = [
    'Great! Let\'s play some more. Choose a number',
    'Okay then. Go on and choose a secret number',
    'I\'m glad! Another round. Choose a number'
];

// Session end replies
const END_SESSION = [
    'Thanks for trying Fun Numbers today. See you next time',
    'Hope you had a nice time. Have fun!',
    'Glad you played with numbers today. Hope to have you next time'
];

/**
 * Gets a random operation to start the game; either addition or multiplication
 * @param {*String} startOp the start op; either an addition or a multiplication
 * @param {*Number} gameCounter the counter for the questions
 * @param {*Number} addResult the total result which started with an addition op
 * @param {*Number} multiplyResult the total result which started with a multiplication op 
 */
function getStartOp(startOp, gameCounter, addResult, multiplyResult) {
    if(startOp == ADD_OP){
        return doAdd(startOp, gameCounter, addResult, multiplyResult);
    } else {
        return doMultiply(startOp, gameCounter, addResult, multiplyResult);
    }
}

/**
 * Randomly selects an operation to perform
 * @param {*String} startOp the start op; either an addition or a multiplication
 * @param {*Number} gameCounter the counter for the questions
 * @param {*Number} addResult the total result which started with an addition op
 * @param {*Number} multiplyResult the total result which started with a multiplication op 
 */
function getNextOp(startOp, gameCounter, addResult, multiplyResult) {
    if (startOp == ADD_OP){
        if (gameCounter == 2){
            return doSubtract(startOp, gameCounter, addResult, multiplyResult);
        } else if(gameCounter == 3){
            return doSubtractSecret(startOp, gameCounter, addResult, multiplyResult);
        } else if (gameCounter == 4) {
            return doMultiply(startOp, gameCounter, addResult, multiplyResult);
        } else {
            return doDivide(startOp, gameCounter, addResult, multiplyResult);
        }
    } else {
        if (gameCounter == 2){
            return doDivide(startOp, gameCounter, addResult, multiplyResult);
        } else if(gameCounter == 3){
            return doDivideSecret(startOp, gameCounter, addResult, multiplyResult);
        } else if (gameCounter == 4) {
            return doSubtract(startOp, gameCounter, addResult, multiplyResult);
        } else {
            return doAdd(startOp, gameCounter, addResult, multiplyResult);
        }
    }
}

/**
 * Does an addition operation
 * @param {*String} startOp the start op; either an addition or a multiplication
 * @param {*Number} gameCounter the counter for the questions
 * @param {*Number} addResult the total result which started with an addition op
 * @param {*Number} multiplyResult the total result which started with a multiplication op 
 */
function doAdd(startOp, gameCounter, addResult, multiplyResult) {
    let newNumber = util.utils.generateRandomNumber(100);
    let result = 0;
    if (startOp == ADD_OP) {
        result = addResult + newNumber;
    } else {
        result = multiplyResult + newNumber;
    }
    let response = 'Add ' + newNumber + ' to your ' + ((gameCounter == 1) ? 'secret number' : 'result'); 
    return [result, response];
}

/**
 * Does a multiplication operation
 * @param {*String} startOp the start op; either an addition or a multiplication
 * @param {*Number} gameCounter the counter for the questions
 * @param {*Number} addResult the total result which started with an addition op
 * @param {*Number} multiplyResult the total result which started with a multiplication op 
 */
function doMultiply(startOp, gameCounter, addResult, multiplyResult) {
    let newNumber = util.utils.generateRandomNumber(20);
    let result = 0;
    if (startOp == ADD_OP) {
        result = addResult * newNumber;
    } else {
        result = multiplyResult * newNumber;
    }
    let response = 'Multiply your ' + ((gameCounter == 1) ? 'secret number' : 'result') + ' by ' + newNumber;
    return [result, response];
}

/**
 * Does a subtraction operation
 * @param {*String} startOp the start op; either an addition or a multiplication
 * @param {*Number} gameCounter the counter for the questions
 * @param {*Number} addResult the total result which started with an addition op
 * @param {*Number} multiplyResult the total result which started with a multiplication op 
 */
function doSubtract(startOp, gameCounter, addResult, multiplyResult) {
    let newNumber = util.utils.generateRandomNumber(100);
    let result = 0;
    if (startOp == ADD_OP) {
        result = addResult - newNumber;
    } else {
        result = multiplyResult - newNumber;
    }
    let response = 'Subtract ' + newNumber + ' from your result';
    return [result, response];
}

/**
 * Subtracts the secret number from the result
 * @param {*String} startOp the start op; either an addition or a multiplication
 * @param {*Number} gameCounter the counter for the questions
 * @param {*Number} addResult the total result which started with an addition op
 * @param {*Number} multiplyResult the total result which started with a multiplication op 
 */
function doSubtractSecret(startOp, gameCounter, addResult, multiplyResult) {
    let result = (startOp == ADD_OP) ? addResult : multiplyResult;
    return [result, 'Subtract your secret number from the result'];
}

/**
 * Subtracts the secret number from the result
 * @param {*String} startOp the start op; either an addition or a multiplication
 * @param {*Number} gameCounter the counter for the questions
 * @param {*Number} addResult the total result which started with an addition op
 * @param {*Number} multiplyResult the total result which started with a multiplication op 
 */
function doDivideSecret(startOp, gameCounter, addResult, multiplyResult) {
    let result = (startOp == ADD_OP) ? addResult : multiplyResult;
    return [result, 'Divide the result by your secret number'];
}

/**
 * Does a division operation
 * @param {*String} startOp the start op; either an addition or a multiplication
 * @param {*Number} gameCounter the counter for the questions
 * @param {*Number} addResult the total result which started with an addition op
 * @param {*Number} multiplyResult the total result which started with a multiplication op 
 */
function doDivide(startOp, gameCounter, addResult, multiplyResult) {
    let newNumber = util.utils.generateRandomNumber(10);
    // avoid diving by large or odd numbers
    while(newNumber % 2 !== 0) {
        newNumber = util.utils.generateRandomNumber(10);
    }
    if (newNumber === 0) newNumber += 2;
    let result = 0;
    if (startOp == ADD_OP) {
        result = addResult/newNumber;
    } else {
        result = multiplyResult/newNumber;
    }
    return [result, 'Divide your result by ' + newNumber];
}

/**
 * Initializes all varibles to their default states
 */
function getDefaultParams(){
    let params = {};
    params[COUNTER] = 1;
    // A value of 0 triggers a null exception on the Context Argument
    params[ADD_RESULT] = '0';
    params[MULTIPLY_RESULT] = '1';
    params[START_OP] = (util.utils.generateRandomNumber(2) == 1) ? ADD_OP : MULTIPLY_OP;

    return params;
}

/**
 * Ends the context for the game and also displays the result
 * @param {*ApiAi App} apiApp the ApiAI App Object
 * @param {*String} startOp the start op; either an addition or a multiplication
 * @param {*Number} gameCounter the counter for the questions
 * @param {*Number} addResult the total result which started with an addition op
 * @param {*Number} multiplyResult the total result which started with a multiplication op 
 */
function endGame(apiApp, startOp, gameCounter, addResult, multiplyResult) {
    let response = 'Your result is ' + ((startOp == ADD_OP) ? addResult: multiplyResult);
    response += '. Do you want to play again?';
    // Add the countext variables
    let params = getDefaultParams();
    apiApp.setContext(CONTEXT_PLAY_GAME, END_LIFESPAN, params);
    apiApp.setContext(CONTEXT_PLAY_AGAIN, DEFAULT_LIFESPAN, {});
    util.utils.buildRichResponse(apiApp, response, response, ['Yes', 'No'], false);
}

/**
 * Keeps the game in progress
 */
module.exports.playGame = (req, res, next) => {
    // Initialize the ApiAi App
    let apiApp = new apiAi({ request: req, response: res });
    // Get the context variables for the app
    let gameCounter = apiApp.getContextArgument(CONTEXT_PLAY_GAME, COUNTER).value;
    let addResult = apiApp.getContextArgument(CONTEXT_PLAY_GAME, ADD_RESULT).value;
    let multiplyResult = apiApp.getContextArgument(CONTEXT_PLAY_GAME, MULTIPLY_RESULT).value;
    let startOp = apiApp.getContextArgument(CONTEXT_PLAY_GAME, START_OP).value;

    // Convert the String values to Number type
    addResult = Number(addResult);
    multiplyResult = Number(multiplyResult);

    if (gameCounter == NUM_QUESTIONS + 1){
        endGame(apiApp, startOp, gameCounter, addResult, multiplyResult);
        return;
    }
    // Perform an operation and retrun an Array of Number result and String response
    let response = (gameCounter == 1) ? getStartOp(startOp, gameCounter, addResult, multiplyResult) 
        : getNextOp(startOp, gameCounter, addResult, multiplyResult);
    
    //console.log(gameCounter, response[1], response[0]);
    
    gameCounter += 1; // Increment the counter
    // Pack the updated variables back to an object and return to the context
    let params = {};
    params[COUNTER] = gameCounter;
    params[ADD_RESULT] = (startOp == ADD_OP) ? response[0].toString() : '0';
    params[MULTIPLY_RESULT] = (startOp == MULTIPLY_OP) ? response[0].toString() : '1';
    params[START_OP] = startOp;
    apiApp.setContext(CONTEXT_PLAY_GAME, DEFAULT_LIFESPAN, params);
    // Return speech response
    util.utils.buildRichResponse(apiApp, response[1], response[1], [], false);
};

/**
 * First method to be called on a game selection
 */
module.exports.beginGame = (req, res, next) => {
    let apiApp = new apiAi({ request: req, response: res });
    // Add the countext variables
    let params = getDefaultParams();
    apiApp.setContext(CONTEXT_PLAY_GAME, DEFAULT_LIFESPAN, params);
    let response = BEGIN_GAME_RES[util.utils.generateRandomNumber(BEGIN_GAME_RES.length)];
    util.utils.buildRichResponse(apiApp, response, response, [], false);
};

/**
 * This initializes a new game session
 */
module.exports.playAgain = (req, res, next) => {
    let apiApp = new apiAi({ request: req, response: res });
    let response = RESTART_GAME_RES[util.utils.generateRandomNumber(RESTART_GAME_RES.length)];
    apiApp.setContext(CONTEXT_PLAY_AGAIN, END_LIFESPAN, {});
    // Add the countext variables
    let params = getDefaultParams();
    apiApp.setContext(CONTEXT_PLAY_GAME, DEFAULT_LIFESPAN, params);
    util.utils.buildRichResponse(apiApp, response, response, [], false);
};

/**
 * This initializes a new game session
 */
module.exports.endSession = (req, res, next) => {
    let apiApp = new apiAi({ request: req, response: res });
    let response = END_SESSION[util.utils.generateRandomNumber(END_SESSION.length)];
    // Add the countext variables
    let params = getDefaultParams();
    apiApp.setContext(CONTEXT_PLAY_AGAIN, END_LIFESPAN, {});
    apiApp.setContext(CONTEXT_PLAY_GAME, END_LIFESPAN, params);
    util.utils.buildRichResponse(apiApp, response, response, [], true);
};