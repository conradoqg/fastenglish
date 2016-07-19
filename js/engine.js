var HistoryStorage = function () { };

HistoryStorage.prototype.load = function () {
    var challengesHistory = store.get('challengesHistory') || {}
    return challengesHistory;
}

HistoryStorage.prototype.add = function (history) {
    store.set('challengesHistory', Object.assign(this.load(), history));
}

var App = function () {
    this.historyStorage = new HistoryStorage();
    this.gameEngine = null;
};

App.prototype.start = function () {
    this.gameEngine = new GameEngine(initialGameState, this.historyStorage);
};

var initialGameState = {
    state: 'MENU',
    runningChallenge: null
};

/* Game Engine */

var GameEngine = function (gameState, historyStorage) {
    this.historyStorage = historyStorage;
    this.gameState = gameState;
};

GameEngine.prototype.start = function (level, questionsAmount, maxTime, endOnTimeout) {
    var self = this;
    this.gameState.state = 'CHALLENGING';
    return challengeCreator(level, questionsAmount, maxTime, this.historyStorage).then(function (challenge) {
        self.gameState.runningChallenge = challenge;
        self.gameState.runningChallenge.start(endOnTimeout);
    });

};

GameEngine.prototype.end = function () {
    this.gameState.state = 'MENU';
    if (this.gameState.runningChallenge) this.gameState.runningChallenge.stop();
    this.gameState.runningChallenge = null;
};

/* Challenge */

var Challenge = function (level, qaPair, maxTime, historyStorage) {
    this.state = 'CREATED';
    this.level = level;
    this.qaPair = qaPair;
    this.maxTime = maxTime;
    this.historyStorage = historyStorage;
    this.setDefaults();
};

Challenge.prototype.start = function (endOnTimeout) {
    this.endOnTimeout = endOnTimeout;

    if (this.state == 'CREATED' || this.state == 'ENDED') {
        this.startTimer();
        this.results = null;
        this.state = 'RUNNING';
        this.nextQuestion();
    }
};

Challenge.prototype.stop = function () {
    if (this.state == 'CREATED' || this.state == 'RUNNING') {
        this.stopTimer();
        this.results = this.calculateResults();
        this.historyStorage.add(this.results);
        this.state = 'ENDED';
        this.setDefaults();
    }
};

Challenge.prototype.restart = function () {
    this.results = null;
    this.start();
};

Challenge.prototype.setDefaults = function () {
    this.correctAnwsers = 0;
    this.startTime = null;
    this.runningMiliseconds = null;
    this.currentQuestion = null;
    this.endOnTimeout = false;
};

Challenge.prototype.checkIfChallengedCameToTheEnd = function () {
    if (!this.hasNextQuestion()) {
        this.stop();
        return true;
    }
    return false;
};

Challenge.prototype.checkIfChallengedTimedout = function () {
    if (this.endOnTimeout && (this.elapsedSeconds() > this.maxTime)) {
        this.stop();
        return true;
    }
    return false;
};

Challenge.prototype.startTimer = function () {
    this.startTime = Date.now();
};

Challenge.prototype.stopTimer = function () {
    if (this.endOnTimeout && this.elapsedSeconds() > this.maxTime) this.runningMiliseconds = this.maxTime;
    else this.runningMiliseconds = this.elapsedSeconds();
};

Challenge.prototype.elapsedSeconds = function () {
    return Date.now() - this.startTime;
};

Challenge.prototype.nextQuestion = function () {

    if (this.checkIfChallengedTimedout() || this.checkIfChallengedCameToTheEnd()) return;

    if (this.currentQuestion == null) this.currentQuestion = 0;
    else this.currentQuestion++;
};

Challenge.prototype.hasNextQuestion = function () {
    return (this.currentQuestion != null ? (this.currentQuestion + 1) < this.qaPair.length : true);
};

Challenge.prototype.anwserQuestion = function (response) {
    if (this.checkIfChallengedTimedout()) return;

    var corrector = getCorrectorByType(this.qaPair[this.currentQuestion].type);
    var correction = corrector.isCorrect(this.qaPair[this.currentQuestion].answers, response);
    if (correction.isCorrect) this.correctAnwsers++;

    this.checkIfChallengedCameToTheEnd()
    this.checkIfChallengedTimedout()

    return correction;
};

Challenge.prototype.calculateResults = function () {
    var result = {};
    var id = uuid.v1();
    result[id] = {
        version: 1,
        date: Date.now(),
        level: this.level,
        milisecondsDone: this.runningMiliseconds,
        milisecondsMax: this.maxTime,
        totalQuestions: this.qaPair.length,
        correctAnwsers: this.correctAnwsers,
        points: 0
    };
    result[id].points = calculatePoints(result[id]);
    return result
}

var SimpleCorrector = function () { };
SimpleCorrector.prototype.isCorrect = function (answers, response) {
    var correction = {
        isCorrect: false,
        correctAnwsers: answers.join(' or '),
        alternative: ''
    };
    answers.forEach(function(element) {
        if (element.toLowerCase().trim() == response.toLowerCase().trim()) {
            correction.isCorrect = true;
        } else {
            correction.alternative += (correction.alternative == '' ? '' : ", ") + element;
        }
    }, this);
    return correction;
};

/* Static function */

var challengeCreator = function (level, questionsAmount, maxTime, historyStorage, fetcher) {
    if (typeof (fetcher) == 'function') return Promise.resolve(new Challenge(level, fetcher(), maxTime, historyStorage));
    else return fetch(firebase.app().options.databaseURL + '/questions.json?orderBy="level"&equalTo="' + level + '"')
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            var questions = [];
            function pickRandomProperty(obj) {
                var result;
                var count = 0;
                for (var prop in obj)
                    if (Math.random() < 1 / ++count)
                        result = prop;
                return result;
            }

            var randomPick = null;
            for (var count = 0; count < questionsAmount; count++) {
                randomPick = pickRandomProperty(json);
                if (randomPick == null) break;
                questions.push(json[randomPick]);
                delete json[randomPick];
            }
            return questions;
        }).then(function (questions) {
            return new Challenge(level, questions, maxTime, historyStorage);
        });
};

var getCorrectorByType = function (type) {
    if (type = 'simple') return new SimpleCorrector();
};

var calculatePoints = function (challengeResult) {
    var result = 0;
    if (!challengeResult.version || challengeResult.version == '1') {
        var percentDone = ((challengeResult.milisecondsDone * 100) / challengeResult.milisecondsMax) / 100;
        var correctQuestionsPercent = (challengeResult.correctAnwsers * 100) / challengeResult.totalQuestions;
        var levelMultiplier = (challengeResult.level == 'EASY' ? 1 : (challengeResult.level == 'MEDIUM' ? 1.3 : 1.7));
        var curvedPercentMultiplier = (1 + Math.pow(1 - percentDone, 2));
        result = (curvedPercentMultiplier * levelMultiplier * correctQuestionsPercent);
        if (isNaN(result)) result = 0;
    } else {
        result = 0;
    }
    return result;
}

/* Tests */

if (typeof (describe) == 'function') {
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

    var HistoryStorage = function () { }
    HistoryStorage.prototype.load = sinon.stub().returns({});
    HistoryStorage.prototype.add = sinon.stub().returns();

    describe('Engine Test', function () {
        describe('App', function () {
            it('should instantiate App', function () {
                var app = new App();
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
                gameEngine.start('EASY', 10, 30000).then(function () {
                    gameEngine.gameState.state.should.be.equal('CHALLENGING');
                }).then(done).catch(done);
            });

            it('should stop a new Challenge', function (done) {
                var gameEngine = new GameEngine(initialGameState, new HistoryStorage());
                gameEngine.start('EASY', 10, 30000).then(function () {
                    gameEngine.end();
                    gameEngine.gameState.state.should.be.equal('MENU');
                }).then(done).catch(done);
            });
        });

        describe('Challenge', function () {
            it('should answer one question', function (done) {
                challengeCreator('EASY', 2, 10000, new HistoryStorage(), fetcherMock).then(function (challenge) {
                    challenge.start();
                    challenge.anwserQuestion('yes');
                    challenge.stop();
                    var results = challenge.results;
                    results.should.be.an.Object();
                    results[Object.keys(results)[0]].correctAnwsers.should.be.equal(1);
                }).then(done).catch(done);
            });

            it('should answer two question', function (done) {
                challengeCreator('EASY', 2, 10000, new HistoryStorage(), fetcherMock).then(function (challenge) {
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
                challengeCreator('EASY', 2, 100000, new HistoryStorage(), fetcherMock).then(function (challenge) {
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
                challengeCreator('EASY', 2, 1000, new HistoryStorage(), fetcherMock).then(function (challenge) {
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
                challengeCreator('EASY', 2, 1000, new HistoryStorage(), fetcherMock).then(function (challenge) {
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
                challengeCreator('EASY', 2, 50, new HistoryStorage(), fetcherMock).then(function (challenge) {
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
                        } catch (e) {
                            done(e);
                        }
                        done();
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

                calculatePoints(testResult).should.be.equal(181);
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

                calculatePoints(testResult).should.be.equal(235.3);
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

                calculatePoints(testResult).should.be.equal(307.7);
            });
        });
    });
}