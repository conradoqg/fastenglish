const challengeCreator = require('./challengeCreator');

class GameEngine {
    constructor(gameState, historyStorage) {
        this.historyStorage = historyStorage;
        this.gameState = gameState;
    }

    start(level, questionsAmount, maxTime, endOnTimeout, fetcherMock) {        
        this.gameState.state = 'CHALLENGING';
        return challengeCreator(level, questionsAmount, maxTime, fetcherMock).then((challenge) => {
            this.gameState.runningChallenge = challenge;
            this.gameState.runningChallenge.start(endOnTimeout);
        });
    }

    end() {
        this.gameState.state = 'MENU';
        if (this.gameState.runningChallenge) this.gameState.runningChallenge.stop();
        this.historyStorage.add(this.gameState.runningChallenge.results);
        this.gameState.runningChallenge = null;
    }
}

module.exports = GameEngine;
