const SimpleCorrector = require('./simpleCorrector');

var challengeCreator = function (level, questionsAmount, maxTime, historyStorage, fetcher) {
    const Challenge = require('./challenge');
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
    if (type == 'simple') return new SimpleCorrector();
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
};

module.exports = {
    challengeCreator,
    getCorrectorByType,
    calculatePoints
};