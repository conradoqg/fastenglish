let { Component } = require('react');
let React = require('react');
let MenuView = require('./menuView');
let ChallengeView = require('./challengeView');
let ProgressView = require('./progressView');
let HistoryChartView = require('./historyChartView');

class AppView extends Component {
    constructor(props) {
        super(props);
        this.progressChanged = this.progressChanged.bind(this);
        this.updateGameState = this.updateGameState.bind(this);
        this.updateHistoryStorageState = this.updateHistoryStorageState.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            gameEngine: props.app.gameEngine,
            historyStorage: props.app.historyStorage,
            progress: null
        };
    }

    componentWillMount() {
        this.state.gameEngine.emitter.on('state', this.updateGameState);
        this.state.historyStorage.emitter.on('historyChanged', this.updateHistoryStorageState);
    }

    componentWillUnmount() {
        this.state.gameEngine.emitter.removeListener('state', this.updateGameState);
        this.state.historyStorage.emitter.removeListener('historyChanged', this.updateHistoryStorageState);
    }

    updateGameState(state) {        
        this.setState({ gameEngine: this.state.gameEngine });
    }

    updateHistoryStorageState() {        
        this.setState({ historyStorage: this.state.historyStorage });
    }

    progressChanged(progress) {
        this.setState({ progress });
    }

    render() {
        let renderToContent = null;

        switch (this.state.gameEngine.gameState.state) {
            case 'MENU':
                renderToContent = (<MenuView engine={this.state.gameEngine} />);
                break;
            case 'CHALLENGING':
            default:
                renderToContent = (<ChallengeView engine={this.state.gameEngine} challenge={this.state.gameEngine.gameState.runningChallenge} progressChanged={this.progressChanged} />);
                break;
        }

        let toRender = (
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
                    <HistoryChartView history={this.state.historyStorage.history}></HistoryChartView>
                </div>
            </div>);

        return toRender;
    }
}

module.exports = AppView;