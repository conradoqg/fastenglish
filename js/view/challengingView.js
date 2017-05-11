const { Component } = require('react');
const Theming = require('../util/theming');
const React = require('react');

class ChallengingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anwser: '',
            challenge: props.challenge,
            lastQuestionResult: ''
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.anwserHandle = this.anwserHandle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.respondHandle = this.respondHandle.bind(this);
        this.render = this.render.bind(this);
    }

    componentDidMount() {        
        this.interval = setInterval(() => {
            if (this.props.challenge.state == 'RUNNING') {
                this.props.challenge.checkIfChallengedTimedout();
                this.props.progressChanged((100 * this.props.challenge.elapsedSeconds()) / this.props.challenge.maxTime);
            } else if (this.props.challenge.state == 'ENDED') {
                clearInterval(this.interval);
                this.setState({ challenge: this.props.challenge });
                this.props.progressChanged(100);
            }
        }, 10);
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    anwserHandle(event) {
        this.setState({
            anwser: event.target.value
        });
    }

    handleKeyPress(event) {
        if (event.key == 'Enter') {
            this.respondHandle();
        }
    }

    respondHandle() {
        var result = this.props.challenge.anwserQuestion(this.state.anwser);

        if (result != null) {
            this.props.challenge.nextQuestion();
            if (result.isCorrect) {
                Theming.getSound('success').play();
                setTimeout(function () {
                    $('#anwserButton').velocity({
                        borderBottomColor: Theming.rgbToHex(Theming.getColor('positive'))
                    }, 300).velocity({
                        borderBottomColor: Theming.rgbToHex(Theming.getColor('frontcolor'))
                    }, 1000);
                }, 200);
            } else Theming.getSound('fail').play();
        }

        this.setState({
            anwser: '',
            challenge: this.props.challenge,
            lastQuestionResult: result
        });
    }

    render() {
        var result = null;
        if (this.state.lastQuestionResult.isCorrect != null && this.state.lastQuestionResult.isCorrect == false) {
            result = (
                <span className='message fail'><b>Correct response: </b>{this.state.lastQuestionResult.correctAnwsers}</span>
            );
        } else if (this.state.lastQuestionResult.isCorrect != null && this.state.lastQuestionResult.isCorrect && this.state.lastQuestionResult.alternative.length > 0) {
            result = (
                <span className='message info'><b>Alternative: </b>{this.state.lastQuestionResult.alternative}</span>
            );
        }

        var toRender = null;

        if (this.props.challenge.state == 'CREATED' || this.props.challenge.state == 'RUNNING') {
            toRender = (
                <div>
                    <div className='middle'>
                        <h2>{this.state.challenge.qaPair[this.state.challenge.currentQuestion].question}</h2>
                        <label>Anwser:
              <input type='text' autoFocus id='anwserButton' className='textboxDefault' value={this.state.anwser} onChange={this.anwserHandle} onKeyPress={this.handleKeyPress} placeholder='Your anwser' />
                        </label>
                        <input type='button' className="btnDefault" onClick={this.respondHandle} value='Next!' />
                    </div>
                    <div className='middle-bottom'>
                        {result}
                    </div>
                </div>
            );
        } else {
            toRender = (
                <div className='middle'>
                    <h2>Challenge Ended!</h2>
                    <div className='middle-bottom'>
                        {result}
                    </div>
                    <input type='button' className="btnDefault" onClick={this.props.challengeEnded} autoFocus value='Check Results' />
                </div>
            );
        }

        return (
            <div>
                {toRender}
            </div>
        );
    }
}

module.exports = ChallengingView;
