const Theming = require('../util/theming');

function progressBarUpdate(id, color0, color1, percentage) {
    var elem = document.getElementById(id);
    if (color0.toLowerCase().startsWith('rgb')) color0 = Theming.rgbToHex(color0);
    if (color1.toLowerCase().startsWith('rgb')) color1 = Theming.rgbToHex(color1);
    var r0 = parseInt(color0.substring(1, 3), 16);
    var g0 = parseInt(color0.substring(3, 5), 16);
    var b0 = parseInt(color0.substring(5, 7), 16);
    var r1 = parseInt(color1.substring(1, 3), 16);
    var g1 = parseInt(color1.substring(3, 5), 16);
    var b1 = parseInt(color1.substring(5, 7), 16);
    var steps = (100 - percentage);
    var rstep = (r1 - r0) / (100);
    var gstep = (g1 - g0) / (100);
    var bstep = (b1 - b0) / (100);
    r0 = Math.floor(r0 + (rstep * percentage));
    g0 = Math.floor(g0 + (gstep * percentage));
    b0 = Math.floor(b0 + (bstep * percentage));
    elem.style.backgroundColor = 'rgb(' + r0 + ',' + g0 + ',' + b0 + ')';
    elem.style.width = steps + '%';
}

function average(array) {
    var sum = 0, j = 0;
    for (var i = 0; i < array.length, isFinite(array[i]); i++) {
        sum += parseFloat(array[i]); ++j;
    }
    return j ? sum / j : 0;
}

function createChart() {
    var windowResizeTimer = null;

    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    var setTimer = function () {
        clearTimeout(windowResizeTimer);
        windowResizeTimer = setTimeout(drawChart, 100);
    };

    $(window).resize(setTimer);
}

const HistoryStorage = require('../engine/historyStorage');

function drawChart() {
    var options = null;
    var chart = null;
    var data = null;
    var rawData = null;
    var historyStorage = new HistoryStorage();

    rawData = historyStorage.load();

    if (!rawData) return;

    data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Easy');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        p: { html: true }
    });
    data.addColumn('number', 'Medium');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        p: { html: true }
    });
    data.addColumn('number', 'Hard');
    data.addColumn({
        type: 'string',
        role: 'tooltip',
        p: { html: true }
    });

    var calculatedData = {};

    for (var index in rawData) {
        var rawRecord = rawData[index];
        if (!rawRecord.version || rawRecord.version == '1') {
            var formatedDate = moment(parseInt(rawRecord.date)).format('L');

            if (!calculatedData[formatedDate]) {
                calculatedData[formatedDate] = {};
                calculatedData[formatedDate]['EASY'] = { min: null, max: null, points: [], average: 0 };
                calculatedData[formatedDate]['MEDIUM'] = { min: null, max: null, points: [], average: 0 };
                calculatedData[formatedDate]['HARD'] = { min: null, max: null, points: [], average: 0 };
            }

            calculatedData[formatedDate][rawRecord.level].max = (calculatedData[formatedDate][rawRecord.level].max == null ? rawRecord.points : Math.max(calculatedData[formatedDate][rawRecord.level].max, rawRecord.points));
            calculatedData[formatedDate][rawRecord.level].min = (calculatedData[formatedDate][rawRecord.level].min == null ? rawRecord.points : Math.min(calculatedData[formatedDate][rawRecord.level].min, rawRecord.points));
            calculatedData[formatedDate][rawRecord.level].points.push(rawRecord.points);
            calculatedData[formatedDate][rawRecord.level].average = average(calculatedData[formatedDate][rawRecord.level].points);

        }
    }

    data.addRow([
        '',
        0,
        '<div class="tooltip">Initial</div>',
        0,
        '<div class="tooltip">Initial</div>',
        0,
        '<div class="tooltip">Initial</div>',
    ]);

    for (index in calculatedData) {
        var calculatedRecord = calculatedData[index];
        data.addRow([
            index,
            calculatedRecord['EASY'].average,
            createCustomHTMLContent('EASY', index, calculatedRecord['EASY']),
            calculatedRecord['MEDIUM'].average,
            createCustomHTMLContent('MEDIUM', index, calculatedRecord['MEDIUM']),
            calculatedRecord['HARD'].average,
            createCustomHTMLContent('HARD', index, calculatedRecord['HARD']),
        ]);
    }

    function createCustomHTMLContent(level, date, value) {
        return '<div class="tooltip">' +
            '<p><b>Level: </b>' + level + '</p>' +
            '<p><b>Date: </b>' + date + '</p>' +
            (value.max != null && value.max >= 0 ? '<p><b>Max: </b>' + value.max.toFixed(2) + '</p>' : '') +
            '<p><b>Average: </b>' + value.average.toFixed(2) + '</p>' +
            (value.min != null && value.min >= 0 ? '<p><b>Min: </b>' + value.min.toFixed(2) + '</p>' : '') +
            '</div>';
    }

    options = {
        titlePosition: 'none',
        axisTitlesPosition: 'none',
        backgroundColor: Theming.getColor('backcolor'),
        pointsVisible: true,
        tooltip: { isHtml: true },
        areaOpacity: 1,
        interpolateNulls: true,
        chartArea: {
            width: '100%',
            left: '0',
            top: '0'
        },
        series: {
            0: { color: Theming.getColor('easy') },
            1: { color: Theming.getColor('medium') },
            2: { color: Theming.getColor('hard') },
        },
        isStacked: false,
        legend: {
            position: 'none'
        },
        hAxis: {
            textPosition: 'none'
        },
        theme: 'maximized',
        vAxis: {
            textPosition: 'none',
            gridlines: {
                count: 0
            }
        }
    };

    var chartElement = $('#chart')[0];

    chart = new google.visualization.AreaChart(chartElement);
    chartElement.innerHTML = '';
    chart.draw(data, options);
}

module.exports = {
    drawChart,
    createChart,
    average,    
    progressBarUpdate    
};