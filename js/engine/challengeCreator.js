let Challenge = require('./challenge');

let challengeCreator = function (level, questionsAmount, maxTime, fetcher) {    
    if (typeof (fetcher) == 'function') return Promise.resolve(new Challenge(level, fetcher(), maxTime));
    else return fetch(firebase.app().options.databaseURL + '/questions.json?orderBy="level"&equalTo="' + level + '"')
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            let questions = [];
            function pickRandomProperty(obj) {
                let result;
                let count = 0;
                for (var prop in obj)
                    if (Math.random() < 1 / ++count)
                        result = prop;
                return result;
            }

            let randomPick = null;
            for (var count = 0; count < questionsAmount; count++) {
                randomPick = pickRandomProperty(json);
                if (randomPick == null) break;
                questions.push(json[randomPick]);
                delete json[randomPick];
            }
            return questions;
        }).then(function (questions) {
            return new Challenge(level, questions, maxTime);
        });
};

module.exports = challengeCreator;