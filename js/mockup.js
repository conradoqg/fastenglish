$(document).ready(function () {
    window.colors = getColors('.colors');
    createChart();

    $('#anwserButton').velocity({
        borderBottomColor: rgbToHex(colors['positive'])
    }, 1000).velocity({
        borderBottomColor: rgbToHex(colors['frontcolor'])
    }, 2000);

    /*$('.fail').velocity({
            opacity: 0
        }, {
            duration: 1000,
            delay: 2000
    });*/

    function initiate(id, color0, color1, percentage) {
        var percentage = 0;
        if (color0.toLowerCase().startsWith('rgb')) color0 = rgbToHex(color0);
        if (color1.toLowerCase().startsWith('rgb')) color1 = rgbToHex(color1);
        var interval = setInterval(function () {
            progressBarUpdate(id, color0, color1, percentage);
            if (percentage >= 100) clearInterval(interval);
            percentage++;
        }, 100);

    }

    initiate('progressBar', colors['positive'], colors['negative'])

    window.HistoryStorage = function () {

    };

    window.HistoryStorage.prototype.load = function () {
        return sampleData;
    }

    var sampleData = {
        '1': {
            date: new Date("07/16/2016").valueOf(),
            level: 'EASY',
            milisecondsDone: 90000,
            milisecondsMax: 900000,
            totalQuestions: 90,
            correctAnwsers: 90,
            points: 122
        },
        '2': {
            date: new Date("08/16/2016").valueOf(),
            level: 'EASY',
            milisecondsDone: 0,
            milisecondsMax: 900000,
            totalQuestions: 90,
            correctAnwsers: 90,
            points: 122
        },
        '3': {
            date: new Date("07/16/2016").valueOf(),
            level: 'MEDIUM',
            milisecondsDone: 0,
            milisecondsMax: 900000,
            totalQuestions: 90,
            correctAnwsers: 90,
            points: 122
        },
        '5': {
            date: new Date("09/16/2016").valueOf(),
            level: 'MEDIUM',
            milisecondsDone: 0,
            milisecondsMax: 900000,
            totalQuestions: 90,
            correctAnwsers: 90,
            points: 122
        },
        '6': {
            date: new Date("09/16/2016").valueOf(),
            level: 'HARD',
            milisecondsDone: 40000,
            milisecondsMax: 900000,
            totalQuestions: 90,
            correctAnwsers: 90,
            points: 122
        }
    }
});