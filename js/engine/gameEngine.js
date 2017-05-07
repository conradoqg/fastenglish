const { challengeCreator } = require('./util');

class GameEngine {
    constructor(gameState, historyStorage) {
        this.historyStorage = historyStorage;
        this.gameState = gameState;
    }

    start(level, questionsAmount, maxTime, endOnTimeout) {
        var self = this;
        this.gameState.state = 'CHALLENGING';
        return challengeCreator(level, questionsAmount, maxTime, this.historyStorage).then(function (challenge) {
            self.gameState.runningChallenge = challenge;
            self.gameState.runningChallenge.start(endOnTimeout);
        });
    }

    end() {
        this.gameState.state = 'MENU';
        if (this.gameState.runningChallenge) this.gameState.runningChallenge.stop();
        this.gameState.runningChallenge = null;
    }
}

module.exports = GameEngine;
