const { Component } = require('react');
const React = require('react');

class ChallengeResultView extends Component {
    constructor(props) {
        super(props);
        this.state = props.challenge.results[Object.keys(this.props.challenge.results)[0]];
        this.render = this.render.bind(this);
    }

    render() {
        return (
            <div>
                <div className='result'>
                    <span><b>Level: </b>{this.state.level}</span>
                    <span><b>Duration: </b>{moment.duration(this.state.milisecondsDone).format('h [hrs], m [min], s [sec], S [ms]')}</span>
                    <span><b>Correct Anwsers: </b>{this.state.correctAnwsers}</span>
                    <span><b>Points: </b>{this.state.points.toFixed(2)}</span>
                </div>
                <input type='button' className="btnDefault" value='Restart!' onClick={this.props.restartChallenge} />
                <input type='button' className="btnDefault" value='Menu' autoFocus onClick={this.props.endGame} />
            </div>
        );
    }
}

module.exports = ChallengeResultView;
