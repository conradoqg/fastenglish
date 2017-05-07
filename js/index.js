require('../styles.less');
const App = require('./engine/app');
const React = require('react');
const ReactDOM = require('react-dom');
const AppView = require('./controller/appView');
const { getColors, createChart } = require('./controller/util');

$(document).ready(function () {
    window.colors = getColors('.colors');
    createChart();
    window.app = new App();
    window.app.start();
    ReactDOM.render(<AppView app={window.app} />, document.getElementById('app'));
});
