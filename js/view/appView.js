const { Component } = require('react');
const React = require('react');
const MenuView = require('./menuView');
const ChallengeView = require('./challengeView');
const ProgressView = require('./progressView');
const HistoryChartView = require('./historyChartView');
const HistoryStorage = require('../engine/historyStorage');

class AppView extends Component {
    constructor(props) {
        super(props);
        this.historyStorage = new HistoryStorage();
        this.gameStarted = this.gameStarted.bind(this);
        this.gameEnded = this.gameEnded.bind(this);
        this.progressChanged = this.progressChanged.bind(this);
        this.historyChanged = this.historyChanged.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            app: props.app,
            progress: null,
            history: this.historyStorage.load()
        };
    }

    gameStarted() {
        this.forceUpdate();
    }

    gameEnded() {
        this.forceUpdate();
    }

    progressChanged(progress) {
        this.setState({ progress });
    }

    historyChanged() {
        this.setState({ history: this.historyStorage.load() });
    }

    render() {
        var renderToContent = null;

        switch (this.state.app.gameEngine.gameState.state) {
            case 'MENU':
                renderToContent = (<MenuView engine={this.state.app.gameEngine} gameStarted={this.gameStarted} />);
                break;
            case 'CHALLENGING':
            default:
                renderToContent = (<ChallengeView engine={this.state.app.gameEngine} challenge={this.state.app.gameEngine.gameState.runningChallenge} gameEnded={this.gameEnded} progressChanged={this.progressChanged} historyChanged={this.historyChanged} />);
                break;
        }

        var toRender = (
            <div className='wrapper'>
                <div className="header">
                    <ProgressView progress={this.state.progress}></ProgressView>
                    <h1>Fast English!</h1>
                </div>
                <div className="main">
                    <div className="box sidebar"></div>
                    <div className="box content">
                        {renderToContent}
                    </div>
                    <div className="box sidebar">
                        <ul className='no-bullets'>
                            <li className='spaced'><a tabIndex='-1' href='https://gitlab.com/conradoqg/fastenglish'>Contribute</a></li>
                            <li className='spaced'><a tabIndex='-1' href='http://conradoqg.eti.br'>Creator</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer">
                    <HistoryChartView history={this.state.history}></HistoryChartView>
                </div>
            </div>);

        return toRender;
    }
}

module.exports = AppView;