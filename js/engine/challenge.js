let CorrectorFactory = require('./correctorFactory');
let uuid = require('uuid');
let EventEmitter = require('events').EventEmitter;

class Challenge {
    constructor(level, qaPair, maxTime) {
        this.state = 'CREATED';
        this.level = level;
        this.qaPair = qaPair;
        this.maxTime = maxTime;
        this.correctAnwsers = 0;
        this.startTime = null;
        this.runningMiliseconds = null;
        this.currentQuestion = null;
        this.emitter = new EventEmitter();
    }

    start(endOnTimeout) {
        this.endOnTimeout = endOnTimeout;

        if (this.state == 'CREATED' || this.state == 'ENDED') {
            this.startTimer();
            this.results = null;
            this.nextQuestion();
            this.setState('RUNNING');
        }
    }

    stop() {
        if (this.state == 'CREATED' || this.state == 'RUNNING') {
            this.stopTimer();
            this.results = this.calculateResults();
            this.setState('ENDED');
        }
    }

    setState(newState) {        
        this.state = newState;
        this.emitter.emit('state', newState);        
    }

    restart() {
        this.correctAnwsers = 0;
        this.startTime = null;
        this.runningMiliseconds = null;
        this.currentQuestion = null;
        this.results = null;
        this.start(this.endOnTimeout);
    }

    checkIfChallengedCameToTheEnd() {
        if (!this.hasNextQuestion()) {
            this.stop();
            return true;
        }
        return false;
    }

    checkIfChallengedTimedout() {
        if (this.endOnTimeout && (this.elapsedSeconds() > this.maxTime)) {
            this.stop();
            return true;
        }
        return false;
    }

    startTimer() {
        this.startTime = Date.now();
    }

    stopTimer() {
        if (this.endOnTimeout && this.elapsedSeconds() > this.maxTime) this.runningMiliseconds = this.maxTime;
        else this.runningMiliseconds = this.elapsedSeconds();
    }

    elapsedSeconds() {
        return Date.now() - this.startTime;
    }

    nextQuestion() {

        if (this.checkIfChallengedTimedout() || this.checkIfChallengedCameToTheEnd()) return;

        if (this.currentQuestion == null) this.currentQuestion = 0;
        else this.currentQuestion++;
        this.emitter.emit('newQuestion');
    }

    hasNextQuestion() {
        return (this.currentQuestion != null ? (this.currentQuestion + 1) < this.qaPair.length : true);
    }

    anwserQuestion(response) {
        if (this.checkIfChallengedTimedout()) return;

        let corrector = CorrectorFactory.getCorrectorByType(this.qaPair[this.currentQuestion].type);
        let correction = corrector.isCorrect(this.qaPair[this.currentQuestion].answers, response);
        if (correction.isCorrect) this.correctAnwsers++;

        this.checkIfChallengedCameToTheEnd();
        this.checkIfChallengedTimedout();

        return correction;
    }

    calculateResults() {
        let result = {};
        let id = uuid.v1();
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
        result[id].points = Challenge.calculatePoints(result[id]);
        return result;
    }

    static calculatePoints(challengeResult) {
        let result = 0;
        if (!challengeResult.version || challengeResult.version == '1') {
            let percentDone = ((challengeResult.milisecondsDone * 100) / challengeResult.milisecondsMax) / 100;
            let correctQuestionsPercent = (challengeResult.correctAnwsers * 100) / challengeResult.totalQuestions;
            let levelMultiplier = (challengeResult.level == 'EASY' ? 1 : (challengeResult.level == 'MEDIUM' ? 1.3 : 1.7));
            let curvedPercentMultiplier = (1 + Math.pow(1 - percentDone, 2));
            result = (curvedPercentMultiplier * levelMultiplier * correctQuestionsPercent);
            if (isNaN(result)) result = 0;
        } else {
            result = 0;
        }
        return result;
    }
}

module.exports = Challenge;