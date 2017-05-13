let { Component } = require('react');
let React = require('react');
let Theming = require('../util/theming');

class HistoryChartView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {        
        createChart(this.props.history);        
    }        

    componentDidUpdate() {        
        drawChart(this.props.history);
    }

    shouldComponentUpdate(nextProps) {        
        return nextProps.history !== this.props.history;
    }

    render() {
        return (<div className='footerWrapper' id='chart'></div>);
    }
}

function average(array) {
    let sum = 0, j = 0;
    for (var i = 0; i < array.length, isFinite(array[i]); i++) {
        sum += parseFloat(array[i]); ++j;
    }
    return j ? sum / j : 0;
}

function createChart(historyData) {
    let windowResizeTimer = null;

    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(() => drawChart(historyData));

    let setTimer = function () {
        clearTimeout(windowResizeTimer);
        windowResizeTimer = setTimeout(() => drawChart(historyData), 100);
    };

    $(window).resize(setTimer);
}

function drawChart(historyData) {
    let options = null;
    let chart = null;
    let data = null;
    let rawData = null;    

    rawData = historyData;

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

    let calculatedData = {};

    for (var index in rawData) {
        let rawRecord = rawData[index];
        if (!rawRecord.version || rawRecord.version == '1') {
            let formatedDate = moment(parseInt(rawRecord.date)).format('L');

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
        let calculatedRecord = calculatedData[index];
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

    let chartElement = $('#chart')[0];

    chart = new google.visualization.AreaChart(chartElement);
    chartElement.innerHTML = '';
    chart.draw(data, options);
}

module.exports = HistoryChartView;