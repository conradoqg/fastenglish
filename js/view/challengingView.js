let { Component } = require('react');
let Theming = require('../util/theming');
let React = require('react');

class ChallengingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anwser: '',
            challenge: props.challenge,
            lastQuestionResult: ''
        };
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.updateChallengeState = this.updateChallengeState.bind(this);
        this.anwserHandle = this.anwserHandle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.respondHandle = this.respondHandle.bind(this);
        this.render = this.render.bind(this);
    }

    componentWillMount() {
        this.state.challenge.emitter.on('state', this.updateChallengeState);
        this.state.challenge.emitter.on('newQuestion', this.updateChallengeState);
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.props.challenge.state == 'RUNNING') {
                this.props.challenge.checkIfChallengedTimedout();
                this.props.progressChanged((100 * this.props.challenge.elapsedSeconds()) / this.props.challenge.maxTime);
            } else if (this.props.challenge.state == 'ENDED') {
                clearInterval(this.interval);
                this.props.progressChanged(100);
            }
        }, 10);
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
        this.state.challenge.emitter.removeListener('state', this.updateChallengeState);
        this.state.challenge.emitter.removeListener('newQuestion', this.updateChallengeState);
    }

    updateChallengeState() {        
        this.setState({ challenge: this.state.challenge });
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
        let result = this.props.challenge.anwserQuestion(this.state.anwser);

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
            lastQuestionResult: result
        });
    }

    renderLastQuestionResult() {
        let lastQuestionResult = null;
        if (this.state.lastQuestionResult.isCorrect != null && this.state.lastQuestionResult.isCorrect == false) {
            lastQuestionResult = (
                <span className='message fail'><b>Correct response: </b>{this.state.lastQuestionResult.correctAnwsers}</span>
            );
        } else if (this.state.lastQuestionResult.isCorrect != null && this.state.lastQuestionResult.isCorrect && this.state.lastQuestionResult.alternative.length > 0) {
            lastQuestionResult = (
                <span className='message info'><b>Alternative: </b>{this.state.lastQuestionResult.alternative}</span>
            );
        }
        return lastQuestionResult;
    }

    renderQuestion() {
        return (<div>
            <h2>{this.state.challenge.qaPair[this.state.challenge.currentQuestion].question}</h2>
            <label>Anwser:
              <input type='text' autoFocus id='anwserButton' className='textboxDefault' value={this.state.anwser} onChange={this.anwserHandle} onKeyPress={this.handleKeyPress} placeholder='Your anwser' />
            </label>
            <input type='button' className="btnDefault" onClick={this.respondHandle} value='Next!' />
        </div>);
    }

    render() {
        let lastQuestionResult = this.renderLastQuestionResult();
        let question = this.renderQuestion();        

        return (
            <div>
                <div className='middle'>
                    {question}
                </div>
                <div className='middle-bottom'>
                    {lastQuestionResult}
                </div>
            </div>
        );
    }
}

module.exports = ChallengingView;
