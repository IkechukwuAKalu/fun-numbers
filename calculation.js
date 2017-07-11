/**
 * This file handles the calculation portion of the app
 * It is important to note that question counter start from 1 and not 0.
 */

const util = require('./util');
const apiAi = require('actions-on-google').ApiAiApp;
const mathjs = require('mathjs');

// Contexts and Lifespans
const CONTEXT_CALCULATE = 'calculate';
const DEFAULT_LIFESPAN = 4;
const END_LIFESPAN = 0;

// Supported operations
const OP_ADD = 'add';
const OP_SUBTRACT = 'subtract';
const OP_MULTIPLY = 'multiply';
const OP_DIVIDE = 'divide';
const OP_INV_DIVIDE = 'inverse_divide';
const OP_SQR_ROOT = 'square_root';
const OP_FACTORIAL = 'factorial';
const OP_POWER = 'power';
const OP_SIN = 'sine';
const OP_COS = 'cos';
const OP_TAN = 'tan';
const OP_PERCENTAGE = 'percentage';

// The initialization replies
const INIT_REPLIES = [
    'Tell me what to calculate',
    'Sure! what should I calculate for you'
];

/**
 * Performs an addition
 * @param {*number} num1 the first number
 * @param {*number} num2 the second number
 */
function doAdd(num1, num2){
    return num1 + num2;
}

/**
 * Does a subtraction
 * @param {*number} num1 the first number
 * @param {*number} num2 the second number
 */
function doSubtract(num1, num2, rawQuery){
    if(/minus/i.test(rawQuery)){
        return num1 - num2;
    }
    return num2 - num1;
}

/**
 * Does a multiplication of a number
 * @param {*number} num1 the first number
 * @param {*number} num2 the second number
 */
function doMultiply(num1, num2){
    num2 = (num2 === 0) ? 1 : num2;
    return num1 * num2;
}

/**
 * Does a division of numbers
 * @param {*number} num1 the first number
 * @param {*number} num2 the second number
 */
function doDivide(operation, num1, num2, rawQuery){
    let match = /divide [0-9]+ by [0-9]+/i.test(rawQuery); // special case
    if (operation == OP_INV_DIVIDE && !match){
        return num2/num1;
    }
    return num1/num2;
}

/**
 * Returns the square root
 * @param {*Number} number the number
 */
function doSquareRoot(number){
    return Math.sqrt(number);
}

/**
 * Returns the number raised to the power
 * @param {*Number} number the base number 
 * @param {*Number} power the power
 */
function doPower(number, power){
    return Math.pow(number, power);
}

/**
 * Returns the factorial of a number
 * @param {*Number} number the number
 */
function factorial(n) {
    if (n == 1){
        return 1;
    }
    return n * factorial(n - 1);
}

/**
 * Does the factorial
 * @param {*Number} number the number
 */
function doFactorial(number){
    if (number > 15){
        return 'too large';
    }
    return factorial(number);
}

/**
 * Returns the Sine of a number
 * @param {*Number} number the number
 */
function doSin(number){
    return Math.sin(number).toFixed(4);
}

/**
 * Returns the Cosine of a number
 * @param {*Number} number the number
 */
function doCos(number) {
    return Math.cos(number).toFixed(4);
}

/**
 * Returns the Tan of a number
 * @param {*Number} number the number
 */
function doTan(number) {
    return Math.tan(number).toFixed(4);
}

/**
 * Returns the percentage of the numbers
 * @param {*Number} num1 the first number
 * @param {*Number} num2 the second number 
 */
function doPercentage(num1, num2){
    if (num2 === 0){
        return (num1/100).toFixed(2);
    }
    return ((num1 * num2)/100).toFixed(2);
}

/**
 * 
 * @param {*String} operation the operation to apply
 * @param {*Number} number1 the first number
 * @param {*Number} number2 the second number 
 */
function performOperation(operation, number1, number2, rawQuery){
    switch(operation){
        case OP_ADD:
            return doAdd(number1, number2);
        case OP_SUBTRACT:
            return doSubtract(number1, number2, rawQuery);
        case OP_MULTIPLY:
            return doMultiply(number1, number2);
        case OP_DIVIDE:
            return doDivide(operation, number1, number2, rawQuery);
        case OP_INV_DIVIDE:
            return doDivide(operation, number1, number2, rawQuery);
        case OP_SQR_ROOT:
            return doSquareRoot(number1);
        case OP_POWER:
            return doPower(number1, number2);
        case OP_FACTORIAL:
            return doFactorial(number1);
        case OP_SIN:
            return doSin(number1);
        case OP_COS:
            return doCos(number1);
        case OP_TAN:
            return doTan(number1);
        case OP_PERCENTAGE:
            return doPercentage(number1, number2);
    }
}

/**
 * Performs a BODMAS calculation using MathJs module
 * @param {*String} query the raw query string
 */
function doCascadeCalc(query) {
    query = query.toLowerCase();
    query = query.replace(/(add|plus|addition|positive|sum)+/gi, '+'); // addition
    query = query.replace(/(subtract|subtraction|minus|negative)+/gi, '-'); // subtraction
    query = query.replace(/(divide( |d by)|over|division)+/gi, '/'); // division
    query = query.replace(/(multiply|multiplication|times|product)/gi, '*'); // multiplication
    query = query.replace(/(factorial)/gi, '!'); // factorial
    query = query.replace(/(and|with|to|by|from|find|calculate|what|is|the|value|of|result|\?|\.|answer|expression| )/gi, ''); // remove unneccessary words
    query = query.replace(/^(!|\/|\*)/gm,'');
    query = query.replace(/(\+|-|\/|\*)$/gm,'');
    let result = 0;
    try{
        result = mathjs.eval(query);
    }catch(err){
        result = ' -1';
    }

    return result;
}

/**
 * Initializes and sets the context to calculation
 */
module.exports.initCalculation = (req, res, next) => {
    let apiApp = new apiAi({ request: req, response: res });
    apiApp.setContext(CONTEXT_CALCULATE, DEFAULT_LIFESPAN, {});
    let response = INIT_REPLIES[util.utils.generateRandomNumber(INIT_REPLIES.length)];
    util.utils.buildRichResponse(apiApp, response, response, []);
};

/**
 * Performs the calculation
 */
module.exports.calculate = (req, res, next) => {
    let apiApp = new apiAi({ request: req, response: res });
    apiApp.setContext(CONTEXT_CALCULATE, DEFAULT_LIFESPAN, {});
    let rawQuery = req.body.result.resolvedQuery;
    let ops =  req.body.result.parameters.calculations;
    let calResult = 0;
    if (ops.length == 1) {
        let operation = ops[0];
        let number1 = Number(req.body.result.parameters.number);
        let number2 = Number(req.body.result.parameters.number1);
        calResult = performOperation(operation, number1, number2, rawQuery);
    } else {
        calResult = doCascadeCalc(rawQuery);
    }
    let response = (calResult != undefined) ? 'The answer is ' + calResult 
        : `Unable to do ${apiApp.getRawInput()}`;
    util.utils.buildRichResponse(apiApp, response, response, []);
};


exports.doCascadeCalc = doCascadeCalc;