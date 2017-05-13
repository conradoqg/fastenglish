require('../styles.less');
let App = require('./engine/app');
let React = require('react');
let ReactDOM = require('react-dom');
let AppView = require('./view/appView');
let Theming = require('./util/theming');

$(document).ready(function () {    
    Theming.load('.colors');    
    let app = new App();
    app.start();
    ReactDOM.render(<AppView app={app} />, document.getElementById('app'));
});
