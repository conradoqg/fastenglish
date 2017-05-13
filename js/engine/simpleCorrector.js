class SimpleCorrector {
    isCorrect(answers, response) {
        let correction = {
            isCorrect: false,
            correctAnwsers: answers.join(' or '),
            alternative: ''
        };
        answers.forEach(function (element) {
            if (element.toLowerCase().trim() == response.toLowerCase().trim()) {
                correction.isCorrect = true;
            } else {
                correction.alternative += (correction.alternative == '' ? '' : ', ') + element;
            }
        }, this);
        return correction;
    }
}

module.exports = SimpleCorrector;
