const sinon = require('sinon');
const rewire = require('rewire');
const App = rewire('../js/engine/app');
const GameEngine = require('../js/engine/gameEngine');
const Challenge = require('../js/engine/challenge');
const challengeCreator = require('../js/engine/challengeCreator');

require('should');

var fetcherMock = function () {
    return [{
        level: 'EASY',
        type: 'simple',
        question: 'Something?',
        answers: [
            'yes',
            'oh yes!'
        ]
    }, {
        level: 'EASY',
        type: 'simple',
        question: 'Something2?',
        answers: [
            'no',
            'oh no!'
        ]
    }];
};

const initialGameState = {
    state: 'MENU',
    runningChallenge: null
};

var HistoryStorage = function () { 
    console.log('asd');
};
HistoryStorage.prototype.load = sinon.stub().returns({});
HistoryStorage.prototype.add = sinon.stub().returns();

App.__set__('HistoryStorage', HistoryStorage);

describe('Engine Test', function () {
    describe('App', function () {
        it('should instantiate App', function () {
            new App();
        });

        it('should start App', function () {
            var app = new App();
            app.start();
        });
    });

    describe('Game Engine', function () {
        it('should instantiate GameEngine', function () {
            var gameEngine = new GameEngine(initialGameState);
            gameEngine.gameState.state.should.be.equal('MENU');
        });

        it('should start a new Challenge', function (done) {
            var gameEngine = new GameEngine(initialGameState);
            gameEngine.start('EASY', 10, 30000, null, fetcherMock).then(function () {
                gameEngine.gameState.state.should.be.equal('CHALLENGING');
            }).then(done).catch(done);
        });

        it('should stop a new Challenge', function (done) {
            var gameEngine = new GameEngine(initialGameState, new HistoryStorage());
            gameEngine.start('EASY', 10, 30000, null, fetcherMock).then(function () {
                gameEngine.end();
                gameEngine.gameState.state.should.be.equal('MENU');
            }).then(done).catch(done);
        });
    });

    describe('Challenge', function () {
        it('should answer one question', function (done) {
            challengeCreator('EASY', 2, 10000, fetcherMock).then(function (challenge) {
                challenge.start();
                challenge.anwserQuestion('yes');
                challenge.stop();
                var results = challenge.results;
                results.should.be.an.Object();
                results[Object.keys(results)[0]].correctAnwsers.should.be.equal(1);
            }).then(done).catch(done);
        });

        it('should answer two question', function (done) {
            challengeCreator('EASY', 2, 10000, fetcherMock).then(function (challenge) {
                challenge.start();
                challenge.anwserQuestion('yes');
                challenge.nextQuestion();
                challenge.anwserQuestion('no');
                var results = challenge.results;
                results.should.be.an.Object();
                results[Object.keys(results)[0]].correctAnwsers.should.be.equal(2);
            }).then(done).catch(done);
        });

        it('should answer question in enough time (stopping with last question)', function (done) {
            challengeCreator('EASY', 2, 100000, fetcherMock).then(function (challenge) {
                challenge.start(true);
                challenge.anwserQuestion('yes');
                challenge.nextQuestion();
                challenge.anwserQuestion('no');
                var results = challenge.results;
                results.should.be.an.Object();
                results[Object.keys(results)[0]].correctAnwsers.should.be.equal(2);
                results[Object.keys(results)[0]].milisecondsDone.should.be.below(1000);
            }).then(done).catch(done);
        });

        it('should answer question in enough time (stopping with stopTimer)', function (done) {
            challengeCreator('EASY', 2, 1000, fetcherMock).then(function (challenge) {
                challenge.start(true);
                challenge.anwserQuestion('yes');
                challenge.stop();
                var results = challenge.results;
                results.should.be.an.Object();
                results[Object.keys(results)[0]].correctAnwsers.should.be.equal(1);
                results[Object.keys(results)[0]].milisecondsDone.should.be.below(1000);
            }).then(done).catch(done);
        });

        it('should answer question in enough time (stopping with nextQuestion)', function (done) {
            challengeCreator('EASY', 2, 1000, fetcherMock).then(function (challenge) {
                challenge.start(true);
                challenge.anwserQuestion('yes');
                challenge.nextQuestion();
                challenge.nextQuestion();
                var results = challenge.results;
                results.should.be.an.Object();
                results[Object.keys(results)[0]].correctAnwsers.should.be.equal(1);
                results[Object.keys(results)[0]].milisecondsDone.should.be.below(1000);
            }).then(done).catch(done);
        });

        it('should not answer question in enough time', function (done) {
            challengeCreator('EASY', 2, 50, fetcherMock).then(function (challenge) {
                challenge.start(true);
                setTimeout(function () {
                    try {
                        challenge.anwserQuestion('yes');
                        challenge.nextQuestion();
                        challenge.anwserQuestion('no');
                        challenge.stop();
                        var results = challenge.results;
                        results.should.be.an.Object();
                        results[Object.keys(results)[0]].correctAnwsers.should.be.equal(0);
                        results[Object.keys(results)[0]].milisecondsDone.should.be.equal(50);
                        challenge = null;
                        done();
                    } catch (e) {
                        done(e);
                    }
                }, 100);
            });
        });
    });

    describe('Static Functions', function () {
        it('calculatePoints should correct calculate (EASY)', function () {
            var testResult = {
                version: 1,
                date: Date.now(),
                level: 'EASY',
                milisecondsDone: 90000,
                milisecondsMax: 900000,
                totalQuestions: 90,
                correctAnwsers: 90
            };

            Challenge.calculatePoints(testResult).should.be.equal(181);
        });
        it('calculatePoints should correct calculate (MEDIUM)', function () {
            var testResult = {
                version: 1,
                date: Date.now(),
                level: 'MEDIUM',
                milisecondsDone: 90000,
                milisecondsMax: 900000,
                totalQuestions: 90,
                correctAnwsers: 90
            };

            Challenge.calculatePoints(testResult).should.be.equal(235.3);
        });
        it('calculatePoints should correct calculate (HARD)', function () {
            var testResult = {
                version: 1,
                date: Date.now(),
                level: 'HARD',
                milisecondsDone: 90000,
                milisecondsMax: 900000,
                totalQuestions: 90,
                correctAnwsers: 90
            };

            Challenge.calculatePoints(testResult).should.be.equal(307.7);
        });
    });
});