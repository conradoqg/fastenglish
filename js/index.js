require('../styles.less');
const App = require('./engine/app');
const React = require('react');
const ReactDOM = require('react-dom');
const AppView = require('./controller/appView');
const Theming = require('./util/theming');
const { createChart } = require('./controller/util');

$(document).ready(function () {    
    Theming.load('.colors');
    createChart();
    const app = new App();
    app.start();
    ReactDOM.render(<AppView app={app} />, document.getElementById('app'));
});
