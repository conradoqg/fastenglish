let { Component } = require('react');
let Theming = require('../util/theming');
let React = require('react');
let KeyboardNavigation = require('./keyboardNavigation');

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
        this.responseHandler = this.responseHandler.bind(this);
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

    componentDidUpdate() {
        if (this.state.anwser == '') {
            $('[id^=label]').first().focus();
        }
    }

    componentWillUnmount() {
        this.state.challenge.emitter.removeListener('state', this.updateChallengeState);
        this.state.challenge.emitter.removeListener('newQuestion', this.updateChallengeState);
    }

    updateChallengeState() {
        this.setState({ challenge: this.state.challenge });
    }

    anwserHandle(event) {
        this.setState({
            anwser: event.target.value || event.target.attributes['value'].value
        });
    }

    responseHandler() {
        let result = this.props.challenge.anwserQuestion(this.state.anwser);

        if (result != null) {
            this.props.challenge.nextQuestion();
            if (result.isCorrect) Theming.getSound('success').play();
            else Theming.getSound('fail').play();
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
        let qaPair = this.state.challenge.qaPair[this.state.challenge.currentQuestion];
        if (qaPair.type == 'simple') {
            let onKeyDown = KeyboardNavigation.createKeyDownHandler({
                'Enter': this.responseHandler
            });
            return (<div>
                <h2>{qaPair.question}</h2>
                <label>Anwser:
                    <input type='text' autoFocus id='anwserButton' className='textboxDefault' value={this.state.anwser} onChange={this.anwserHandle} onKeyDown={onKeyDown} placeholder='Your anwser' />
                </label>
                <input type='button' className="btnDefault" onClick={this.responseHandler} value='Next!' />
            </div>);
        } else if (qaPair.type == 'choice') {
            let prev = (array, index) => { return (index - 1 < 0 ? array.length - 1 : index - 1); };
            let next = (array, index) => { return (index + 1 == array.length ? 0 : index + 1); };
            return (<div>
                <h2>{qaPair.question}</h2>
                <label>Anwser: {qaPair.options.map((option, index) => {
                    let generateId = (baseId, id) => {
                        return baseId + id.replace('/', '').replace(' ', '');
                    };
                    let anwser = (this.state.anwser == '' && index == 0 ? option : this.state.anwser);
                    let onKeyDown = KeyboardNavigation.createKeyDownHandler({
                        'Enter': this.responseHandler,
                        'ArrowLeft': generateId('label', qaPair.options[prev(qaPair.options, index)]),
                        'ArrowRight': generateId('label', qaPair.options[next(qaPair.options, index)])
                    });
                    return (<div key={index} style={{ display: 'inline' }}>
                        <input type="radio" id={generateId('anwser', option)} name={generateId('awnser', option)} className='radioDefault' value={option} checked={option == anwser} onChange={this.anwserHandle} /><label id={generateId('label', option)} htmlFor={generateId('anwser', option)} tabIndex='0' onFocus={this.anwserHandle} value={option} onKeyDown={onKeyDown}> <span></span> {option} </label>
                    </div>);
                })}
                </label>
                <input type='button' className="btnDefault" onClick={this.responseHandler} value='Next!' />
            </div >);
        }
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
