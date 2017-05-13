let challengeCreator = require('./challengeCreator');
let EventEmitter = require('events').EventEmitter;

class GameEngine {
    constructor(gameState, historyStorage) {
        this.historyStorage = historyStorage;
        this.gameState = gameState;
        this.emitter = new EventEmitter();
    }

    start(level, questionsAmount, maxTime, endOnTimeout, fetcherMock) {
        return challengeCreator(level, questionsAmount, maxTime, fetcherMock).then((challenge) => {
            this.gameState.runningChallenge = challenge;
            this.gameState.runningChallenge.start(endOnTimeout);
            this.setState('CHALLENGING');
        });
    }

    end() {        
        if (this.gameState.runningChallenge) this.gameState.runningChallenge.stop();
        this.historyStorage.add(this.gameState.runningChallenge.results);
        this.gameState.runningChallenge = null;
        this.setState('MENU');        
    }    

    setState(newState) {
        this.gameState.state = newState;
        this.emitter.emit('state', newState);
    }
}

module.exports = GameEngine;
