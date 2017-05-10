require('../styles.less');
const App = require('./engine/app');
const React = require('react');
const ReactDOM = require('react-dom');
const AppView = require('./view/appView');
const Theming = require('./util/theming');
const { createChart } = require('./view/util');

$(document).ready(function () {    
    Theming.load('.colors');
    createChart();
    const app = new App();
    app.start();
    ReactDOM.render(<AppView app={app} />, document.getElementById('app'));
});
