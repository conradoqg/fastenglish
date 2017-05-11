const { Component } = require('react');
const React = require('react');

class MainMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedDificulty: 'EASY',
            selectedQuestionsAmount: '5',
            selectedMaxSeconds: '100000'
        };
        this.toggleDificultyChange = this.toggleDificultyChange.bind(this);
        this.toggleQuestionsAmountChange = this.toggleQuestionsAmountChange.bind(this);
        this.toggleMaxSecondsChange = this.toggleMaxSecondsChange.bind(this);
        this.startChallengeHandler = this.startChallengeHandler.bind(this);
        this.optionsHandler = this.optionsHandler.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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
            <div className='middle'>
                <label className='optionGroupTitle'>
                    <span className='title'>Dificulty: </span>
                    <input type="radio" id='dificultyEasy' name='dificulty' className='radioDefault' value="EASY" checked={(this.state.selectedDificulty == 'EASY')} onChange={this.toggleDificultyChange} /><label id='labelDificultyEasy' htmlFor='dificultyEasy' tabIndex='0' onFocus={() => $('#dificultyEasy').prop('checked', true)} onKeyDown={(e) => { return this.handleKeyPress(e, 'labelDificultyHard', 'labelDificultyMedium', 'btnOptions', 'labelQuestionsLow'); }}> <span></span> EASY </label>
                    <input type="radio" id='dificultyMedium' name='dificulty' className='radioDefault' value="MEDIUM" checked={(this.state.selectedDificulty == 'MEDIUM')} onChange={this.toggleDificultyChange} /><label id='labelDificultyMedium' htmlFor='dificultyMedium' tabIndex='1' onFocus={() => $('#dificultyMedium').prop('checked', true)} onKeyDown={(e) => { return this.handleKeyPress(e, 'labelDificultyEasy', 'labelDificultyHard', 'btnOptions', 'labelQuestionsMiddle'); }}> <span></span> MEDIUM </label>
                    <input type="radio" id='dificultyHard' name='dificulty' className='radioDefault' value="HARD" checked={(this.state.selectedDificulty == 'HARD')} onChange={this.toggleDificultyChange} /><label id='labelDificultyHard' htmlFor='dificultyHard' tabIndex='2' onFocus={() => $('#dificultyHard').prop('checked', true)} onKeyDown={(e) => { return this.handleKeyPress(e, 'labelDificultyMedium', 'labelDificultyEasy', 'btnOptions', 'labelQuestionsHight'); }}> <span></span> HARD </label>
                </label>
                <label className='optionGroupTitle'>
                    <span className='title'>Questions Amount: </span>
                    <input type="radio" id='questionsLow' name='questionsAmount' className='radioDefault' value="5" checked={(this.state.selectedQuestionsAmount == '5')} onChange={this.toggleQuestionsAmountChange} /><label id='labelQuestionsLow' htmlFor='questionsLow' tabIndex='3' onFocus={() => $('#questionsLow').prop('checked', true)} onKeyDown={(e) => { return this.handleKeyPress(e, 'labelQuestionsHight', 'labelQuestionsMiddle', 'labelDificultyEasy', 'labelTargetTimeLow'); }}> <span></span> 5 </label>
                    <input type="radio" id='questionsMiddle' name='questionsAmount' className='radioDefault' value="60" checked={(this.state.selectedQuestionsAmount == '60')} onChange={this.toggleQuestionsAmountChange} /><label id='labelQuestionsMiddle' htmlFor='questionsMiddle' tabIndex='4' onFocus={() => $('#questionsMiddle').prop('checked', true)} onKeyDown={(e) => { return this.handleKeyPress(e, 'labelQuestionsLow', 'labelQuestionsHight', 'labelDificultyMedium', 'labelTargetTimeMiddle'); }}> <span></span> 60 </label>
                    <input type="radio" id='questionsHight' name='questionsAmount' className='radioDefault' value="90" checked={(this.state.selectedQuestionsAmount == '90')} onChange={this.toggleQuestionsAmountChange} /><label id='labelQuestionsHight' htmlFor='questionsHight' tabIndex='5' onFocus={() => $('#questionsHight').prop('checked', true)} onKeyDown={(e) => { return this.handleKeyPress(e, 'labelQuestionsMiddle', 'labelQuestionsLow', 'labelDificultyHard', 'labelTargetTimeHight'); }} > <span></span> 90 </label>
                </label>
                <label className='optionGroupTitle'>
                    <span className='title'>Target Time (minutes): </span>
                    <input type="radio" id='targetTimeLow' name='targetTime' className='radioDefault' value="100000" checked={(this.state.selectedMaxSeconds == '100000')} onChange={this.toggleMaxSecondsChange} /><label id='labelTargetTimeLow' htmlFor='targetTimeLow' tabIndex='6' onFocus={() => $('#targetTimeLow').prop('checked', true)} onKeyDown={(e) => { return this.handleKeyPress(e, 'labelTargetTimeHight', 'labelTargetTimeMiddle', 'labelQuestionsLow', 'btnStart'); }}> <span></span> 10 </label>
                    <input type="radio" id='targetTimeMiddle' name='targetTime' className='radioDefault' value="600000" checked={(this.state.selectedMaxSeconds == '600000')} onChange={this.toggleMaxSecondsChange} /><label id='labelTargetTimeMiddle' htmlFor='targetTimeMiddle' tabIndex='7' onFocus={() => $('#targetTimeMiddle').prop('checked', true)} onKeyDown={(e) => { return this.handleKeyPress(e, 'labelTargetTimeLow', 'labelTargetTimeHight', 'labelQuestionsMiddle', 'btnStart'); }}> <span></span> 10 </label>
                    <input type="radio" id='targetTimeHight' name='targetTime' className='radioDefault' value="900000" checked={(this.state.selectedMaxSeconds == '900000')} onChange={this.toggleMaxSecondsChange} /><label id='labelTargetTimeHight' htmlFor='targetTimeHight' tabIndex='8' onFocus={() => $('#targetTimeHight').prop('checked', true)} onKeyDown={(e) => { return this.handleKeyPress(e, 'labelTargetTimeMiddle', 'labelTargetTimeLow', 'labelQuestionsHight', 'btnStart'); }}> <span></span> 15 </label>
                </label>
                <input type='button' id='btnStart' className="btnDefault" autoFocus value={this.state.loading ? 'Loading...' : 'Start!'} disabled={this.state.loading} onClick={this.startChallengeHandler} tabIndex='9' onKeyDown={(e) => { return this.handleKeyPress(e, 'btnOptions', 'btnOptions', 'labelTargetTimeLow', 'labelDificultyEasy'); }} />
                <input type='button' id='btnOptions' className="btnDefault" value='Options' onClick={this.optionsHandler} tabIndex='10' onKeyDown={(e) => { return this.handleKeyPress(e, 'btnStart', 'btnStart', 'labelTargetTimeLow', 'labelDificultyEasy'); }} />
            </div>);
    }
}

module.exports = MainMenuView;