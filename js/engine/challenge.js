const { calculatePoints, getCorrectorByType } = require('./util');

class Challenge {
    constructor(level, qaPair, maxTime, historyStorage) {
        this.state = 'CREATED';
        this.level = level;
        this.qaPair = qaPair;
        this.maxTime = maxTime;
        this.historyStorage = historyStorage;
        this.setDefaults();
    }

    start(endOnTimeout) {
        this.endOnTimeout = endOnTimeout;

        if (this.state == 'CREATED' || this.state == 'ENDED') {
            this.startTimer();
            this.results = null;
            this.state = 'RUNNING';
            this.nextQuestion();
        }
    }

    stop() {
        if (this.state == 'CREATED' || this.state == 'RUNNING') {
            this.stopTimer();
            this.results = this.calculateResults();
            this.historyStorage.add(this.results);
            this.state = 'ENDED';
            this.setDefaults();
        }
    }

    restart() {
        this.results = null;
        this.start();
    }

    setDefaults() {
        this.correctAnwsers = 0;
        this.startTime = null;
        this.runningMiliseconds = null;
        this.currentQuestion = null;
        this.endOnTimeout = false;
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
    }

    hasNextQuestion() {
        return (this.currentQuestion != null ? (this.currentQuestion + 1) < this.qaPair.length : true);
    }

    anwserQuestion(response) {
        if (this.checkIfChallengedTimedout()) return;

        var corrector = getCorrectorByType(this.qaPair[this.currentQuestion].type);
        var correction = corrector.isCorrect(this.qaPair[this.currentQuestion].answers, response);
        if (correction.isCorrect) this.correctAnwsers++;

        this.checkIfChallengedCameToTheEnd();
        this.checkIfChallengedTimedout();

        return correction;
    }

    calculateResults() {
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
        return result;
    }
}

module.exports = Challenge;