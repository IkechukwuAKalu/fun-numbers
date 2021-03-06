/**
* This is entry point into the application. Start the server from this file
*/

const express = require('express');
const bodyParser = require('body-parser');
const game = require('./game');
const calculation = require('./calculation');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const LISTEN_PORT = 8000;

const OP_GAME = 'game';
const OP_CALCULATE = 'calculate';

// Context actions
const ACTION_GAME = 'play.game';
const ACTION_PLAY_AGAIN_YES = 'play_game_again.yes';
const ACTION_PLAY_AGAIN_NO = 'play_game_again.no';
const ACTION_CALCULATE = 'action.calculate';
const ACTION_CALCULATE_AGAIN_YES = 'calculate.calculate.yes';
const ACTION_CALCULATE_AGAIN_NO = 'calculate.calculate.no';

app.post('/fun-numbers', (req, res, next) => {
    let operation = req.body.result.parameters.operation;
    if (operation == OP_GAME) {
        game.beginGame(req, res, next);
    } else if(operation == OP_CALCULATE) {
        calculation.initCalculation(req, res, next);
    }

    let action = req.body.result.action;
    switch(action) {
        case ACTION_GAME:
            game.playGame(req, res, next);
            break;
        case ACTION_PLAY_AGAIN_YES:
            game.playAgain(req, res, next);
            break;
        case ACTION_PLAY_AGAIN_NO:
            game.endSession(req, res, next);
            break;
        case ACTION_CALCULATE:
            calculation.calculate(req, res, next);
            break;
        case ACTION_CALCULATE_AGAIN_YES:
            calculation.calculateAgain(req, res, next);
            break;
        case ACTION_CALCULATE_AGAIN_NO:
            calculation.endSession(req, res, next);
            break;
    }
});

app.use((err, req, res, next) => {
    console.log({ error: err });
});

app.listen(process.env.PORT || LISTEN_PORT, () => {
    console.log('Server up and running');
});