const HistoryStorage = require('./historyStorage');
const GameEngine = require('./gameEngine');

const initialGameState = {
    state: 'MENU',
    runningChallenge: null
};

class App {
    constructor() {
        this.historyStorage = new HistoryStorage();
        this.gameEngine = null;
    }

    start() {
        this.gameEngine = new GameEngine(initialGameState, this.historyStorage);
    }
}

module.exports = App;