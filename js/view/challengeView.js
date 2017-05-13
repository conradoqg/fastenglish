const { Component } = require('react');
const React = require('react');
const ChallengingView = require('./challengingView');
const ChallengeResultView = require('./challengeResultView');

class ChallengeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            challenge: props.challenge
        };
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.updateState = this.updateState.bind(this);
        this.restartChallenge = this.restartChallenge.bind(this);
        this.endGame = this.endGame.bind(this);        
        this.render = this.render.bind(this);
    }

    componentWillMount() {
        this.state.challenge.emitter.on('state', this.updateState);
    }

    componentWillUnmount() {
        this.state.challenge.emitter.removeListener('state', this.updateState);
    }

    updateState(state) {
        console.log(`challenge state changed to ${state}`);
        this.setState({ challenge: this.state.challenge });
    }    

    restartChallenge() {
        this.props.challenge.restart();        
    }

    endGame() {        
        this.props.engine.end();        
    }

    render() {
        switch (this.state.challenge.state) {
            case 'CREATED':
            case 'RUNNING':
                return (<ChallengingView challenge={this.state.challenge} progressChanged={this.props.progressChanged} />);
            case 'ENDED':
                return (<ChallengeResultView challenge={this.state.challenge} endGame={this.endGame} restartChallenge={this.restartChallenge} />);
            default:
                break;
        }
    }
}

module.exports = ChallengeView;