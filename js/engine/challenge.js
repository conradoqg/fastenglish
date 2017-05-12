const CorrectorFactory = require('./correctorFactory');
const uuid = require('uuid');

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
            this.state = 'ENDED';            
        }
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
    }

    hasNextQuestion() {
        return (this.currentQuestion != null ? (this.currentQuestion + 1) < this.qaPair.length : true);
    }

    anwserQuestion(response) {
        if (this.checkIfChallengedTimedout()) return;

        var corrector = CorrectorFactory.getCorrectorByType(this.qaPair[this.currentQuestion].type);
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
        result[id].points = Challenge.calculatePoints(result[id]);
        return result;
    }

    static calculatePoints(challengeResult) {
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
}

module.exports = Challenge;