const { Component } = require('react');
const React = require('react');

class MainMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            loading: false,
            selectedDificulty: 'EASY',
            selectedQuestionsAmount: '30',
            selectedMaxSeconds: '300000'
        };
        this.toggleDificultyChange = this.toggleDificultyChange.bind(this);
        this.toggleQuestionsAmountChange = this.toggleQuestionsAmountChange.bind(this);
        this.toggleMaxSecondsChange = this.toggleMaxSecondsChange.bind(this);
        this.startChallengeHandler = this.startChallengeHandler.bind(this);
        this.optionsHandler = this.optionsHandler.bind(this);
        this.render = this.render.bind(this);
    }    

    toggleDificultyChange(event) {
        this.setState({
            selectedDificulty: event.target.value
        });
    }

    toggleQuestionsAmountChange(event) {
        this.setState({
            selectedQuestionsAmount: event.target.value
        });
    }

    toggleMaxSecondsChange(event) {
        this.setState({
            selectedMaxSeconds: event.target.value
        });
    }

    startChallengeHandler() {
        var self = this;
        this.setState({
            loading: true
        });
        this.props.engine.start(this.state.selectedDificulty, this.state.selectedQuestionsAmount, this.state.selectedMaxSeconds, true).then(function () {
            self.setState({
                loading: false
            });
            self.props.gameStarted();
        });
    }

    optionsHandler() {
        this.props.changeMenuTo('OPTIONS');
    }

    render() {
        return (
            <div className='middle'>
                <label className='optionGroupTitle'>
                    <span className='title'>Dificulty: </span>
                    <input type="radio" id='dificultyEasy' name='dificulty' className='radioDefault' value="EASY" checked={(this.state.selectedDificulty == 'EASY')} onChange={this.toggleDificultyChange} /><label htmlFor='dificultyEasy'> <span></span> EASY </label>
                    <input type="radio" id='dificultyMedium' name='dificulty' className='radioDefault' value="MEDIUM" checked={(this.state.selectedDificulty == 'MEDIUM')} onChange={this.toggleDificultyChange} /><label htmlFor='dificultyMedium'> <span></span> MEDIUM </label>
                    <input type="radio" id='dificultyHard' name='dificulty' className='radioDefault' value="HARD" checked={(this.state.selectedDificulty == 'HARD')} onChange={this.toggleDificultyChange} /><label htmlFor='dificultyHard'> <span></span> HARD </label>
                </label>
                <label className='optionGroupTitle'>
                    <span className='title'>Questions Amount: </span>
                    <input type="radio" id='questionsLow' name='questionsAmount' className='radioDefault' value="30" checked={(this.state.selectedQuestionsAmount == '30')} onChange={this.toggleQuestionsAmountChange} /><label htmlFor='questionsLow'> <span></span> 30 </label>
                    <input type="radio" id='questionsMiddle' name='questionsAmount' className='radioDefault' value="60" checked={(this.state.selectedQuestionsAmount == '60')} onChange={this.toggleQuestionsAmountChange} /><label htmlFor='questionsMiddle'> <span></span> 60 </label>
                    <input type="radio" id='questionsHight' name='questionsAmount' className='radioDefault' value="90" checked={(this.state.selectedQuestionsAmount == '90')} onChange={this.toggleQuestionsAmountChange} /><label htmlFor='questionsHight'> <span></span> 90 </label>
                </label>
                <label className='optionGroupTitle'>
                    <span className='title'>Target Time (minutes): </span>
                    <input type="radio" id='targetTimeLow' name='targetTime' className='radioDefault' value="300000" checked={(this.state.selectedMaxSeconds == '300000')} onChange={this.toggleMaxSecondsChange} /><label htmlFor='targetTimeLow'> <span></span> 5 </label>
                    <input type="radio" id='targetTimeMiddle' name='targetTime' className='radioDefault' value="600000" checked={(this.state.selectedMaxSeconds == '600000')} onChange={this.toggleMaxSecondsChange} /><label htmlFor='targetTimeMiddle'> <span></span> 10 </label>
                    <input type="radio" id='targetTimeHight' name='targetTime' className='radioDefault' value="900000" checked={(this.state.selectedMaxSeconds == '900000')} onChange={this.toggleMaxSecondsChange} /><label htmlFor='targetTimeHight'> <span></span> 15 </label>
                </label>
                <input type='button' className="btnDefault" autoFocus value={this.state.loading ? 'Loading...' : 'Start!'} disabled={this.state.loading} onClick={this.startChallengeHandler} />
                <input type='button' className="btnDefault" value='Options' onClick={this.optionsHandler} />
            </div>);
    }
}

module.exports = MainMenuView;