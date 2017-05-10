const { Component } = require('react');
const React = require('react');

class ChallengeResultView extends Component {
    constructor(props) {
        super(props);
        this.state = props.challenge.results[Object.keys(this.props.challenge.results)[0]];
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.render = this.render.bind(this);
    }

    handleKeyPress(e, previousId, nextId, topId, bottomId) {
        let el = null;

        if (e.keyCode == 39 && nextId) { // KEY_RIGHT
            el = $('#' + nextId);
        }
        if (e.keyCode == 37 && previousId) { // KEY_LEFT
            el = $('#' + previousId);
        }
        if (e.keyCode == 38 && topId) { // KEY_UP
            el = $('#' + topId);
        }
        if (e.keyCode == 40 && bottomId) { // KEY_DOWN
            el = $('#' + bottomId);
        }

        if (el) {
            el.focus();
            return false;
        }
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
                <input type='button' id='btnRestart' className="btnDefault" value='Restart!' onClick={this.props.restartChallenge} onKeyDown={(e) => { return this.handleKeyPress(e, 'btnMenu', 'btnMenu', null, null); }} />
                <input type='button' id='btnMenu' className="btnDefault" value='Menu' autoFocus onClick={this.props.endGame} onKeyDown={(e) => { return this.handleKeyPress(e, 'btnRestart', 'btnRestart', null, null); }} />
            </div>
        );
    }
}

module.exports = ChallengeResultView;
