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
        this.restartChallenge = this.restartChallenge.bind(this);
        this.endGame = this.endGame.bind(this);
        this.challengeEnded = this.challengeEnded.bind(this);
        this.render = this.render.bind(this);
    }

    restartChallenge() {
        this.props.challenge.restart();
        this.forceUpdate();
    }

    endGame() {
        this.props.historyChanged();
        this.props.engine.end();
        this.props.gameEnded();
    }

    challengeEnded() {
        this.props.historyChanged();
        this.forceUpdate();
    }

    render() {
        switch (this.state.challenge.state) {
            case 'CREATED':
            case 'RUNNING':
                return (<ChallengingView challenge={this.state.challenge} challengeEnded={this.challengeEnded} progressChanged={this.props.progressChanged} />);
            case 'ENDED':
                return (<ChallengeResultView challenge={this.state.challenge} endGame={this.endGame} restartChallenge={this.restartChallenge} />);
            default:
                break;
        }
    }
}

module.exports = ChallengeView;