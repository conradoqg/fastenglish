const { Component } = require('react');
const React = require('react');
const MenuView = require('./menuView');
const ChallengeView = require('./challengeView');

class AppView extends Component {
    constructor(props) {
        super(props);
        this.state = props.app;
        this.gameStarted = this.gameStarted.bind(this);
        this.gameEnded = this.gameEnded.bind(this);
        this.render = this.render.bind(this);
    }
    
    gameStarted() {
        this.forceUpdate();
    }

    gameEnded() {
        this.forceUpdate();
    }

    componentDidMount() {

    }

    render() {
        var renderToContent = null;

        switch (this.state.gameEngine.gameState.state) {
            case 'MENU':
                renderToContent = (<MenuView engine={this.state.gameEngine} gameStarted={this.gameStarted} />);
                break;
            case 'CHALLENGING':                
            default:
                renderToContent = (<ChallengeView engine={this.state.gameEngine} challenge={this.state.gameEngine.gameState.runningChallenge} gameEnded={this.gameEnded} />);                         
                break;
        }        

        var toRender = (
            <div className='wrapper'>
                <div className="header">
                    <div className='progressBar' id='progressBar'></div>
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
                    <div className='footerWrapper' id='chart'></div>
                </div>
            </div>);

        return toRender;
    }
}

module.exports = AppView;