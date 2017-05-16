let { Component } = require('react');
let React = require('react');
let KeyboardNavigation = require('./keyboardNavigation');

class MainMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedDifficulty: 'EASY',
            selectedQuestionsAmount: '30',
            selectedMaxSeconds: '300000'
        };
        this.toggleDifficultyChange = this.toggleDifficultyChange.bind(this);
        this.toggleQuestionsAmountChange = this.toggleQuestionsAmountChange.bind(this);
        this.toggleMaxSecondsChange = this.toggleMaxSecondsChange.bind(this);
        this.startChallengeHandler = this.startChallengeHandler.bind(this);
        this.optionsHandler = this.optionsHandler.bind(this);        
        this.render = this.render.bind(this);
    }

    toggleDifficultyChange(event) {
        this.setState({
            selectedDifficulty: event.target.value
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
        this.setState({
            loading: true
        });
        this.props.engine.start(this.state.selectedDifficulty, this.state.selectedQuestionsAmount, this.state.selectedMaxSeconds, true);
    }

    optionsHandler() {
        this.props.changeMenuTo('OPTIONS');
    }

    checkOnFocus(event) {
        $(`#${event.target.htmlFor}`).prop('checked', true);
    }

    render() {
        let onKeyDownDifficultyEasyRadio = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'labelDifficultyHard',
            'ArrowRight': 'labelDifficultyMedium',
            'ArrowUp': 'btnOptions',
            'ArrowDown': 'labelQuestionsLow'
        });
        let onKeyDownDifficultyMediumRadio = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'labelDifficultyEasy',
            'ArrowRight': 'labelDifficultyHard',
            'ArrowUp': 'btnOptions',
            'ArrowDown': 'labelQuestionsMiddle'
        });
        let onKeyDownDifficultyHardRadio = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'labelDifficultyMedium',
            'ArrowRight': 'labelDifficultyEasy',
            'ArrowUp': 'btnOptions',
            'ArrowDown': 'labelQuestionsHight'
        });
        let onKeyDownQuestionsLowRadio = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'labelQuestionsHight',
            'ArrowRight': 'labelQuestionsMiddle',
            'ArrowUp': 'labelDifficultyEasy',
            'ArrowDown': 'labelTargetTimeLow'
        });
        let onKeyDownQuestionsMiddleRadio = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'labelQuestionsLow',
            'ArrowRight': 'labelQuestionsHight',
            'ArrowUp': 'labelDifficultyMedium',
            'ArrowDown': 'labelTargetTimeMiddle'
        });
        let onKeyDownQuestionsHightRadio = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'labelQuestionsMiddle',
            'ArrowRight': 'labelQuestionsLow',
            'ArrowUp': 'labelDifficultyHard',
            'ArrowDown': 'labelTargetTimeHight'
        });
        let onKeyDownTargetTimeLowRadio = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'labelTargetTimeHight',
            'ArrowRight': 'labelTargetTimeMiddle',
            'ArrowUp': 'labelQuestionsLow',
            'ArrowDown': 'btnStart'
        });
        let onKeyDownTargetTimeMiddleRadio = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'labelTargetTimeLow',
            'ArrowRight': 'labelTargetTimeHight',
            'ArrowUp': 'labelQuestionsMiddle',
            'ArrowDown': 'btnStart'
        });
        let onKeyDownTargetTimeHightRadio = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'labelTargetTimeMiddle',
            'ArrowRight': 'labelTargetTimeLow',
            'ArrowUp': 'labelQuestionsHight',
            'ArrowDown': 'btnStart'
        });
        let onKeyDownStartButton = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'btnOptions',
            'ArrowRight': 'btnOptions',
            'ArrowUp': 'labelTargetTimeLow',
            'ArrowDown': 'labelDifficultyEasy'
        });
        let onKeyDownOptionsButton = KeyboardNavigation.createKeyDownHandler({
            'ArrowLeft': 'btnStart',
            'ArrowRight': 'btnStart',
            'ArrowUp': 'labelTargetTimeLow',
            'ArrowDown': 'labelDifficultyEasy'
        });

        return (
            <div className='middle'>
                <label className='optionGroupTitle'>
                    <span className='title'>Difficulty: </span>
                    <input type="radio" id='difficultyEasy' name='difficulty' className='radioDefault' value="EASY" checked={(this.state.selectedDifficulty == 'EASY')} onChange={this.toggleDifficultyChange} /><label id='labelDifficultyEasy' htmlFor='difficultyEasy' tabIndex='0' onFocus={this.checkOnFocus} onKeyDown={onKeyDownDifficultyEasyRadio}> <span></span> EASY </label>
                    <input type="radio" id='difficultyMedium' name='difficulty' className='radioDefault' value="MEDIUM" checked={(this.state.selectedDifficulty == 'MEDIUM')} onChange={this.toggleDifficultyChange} /><label id='labelDifficultyMedium' htmlFor='difficultyMedium' tabIndex='1' onFocus={this.checkOnFocus} onKeyDown={onKeyDownDifficultyMediumRadio}> <span></span> MEDIUM </label>
                    <input type="radio" id='difficultyHard' name='difficulty' className='radioDefault' value="HARD" checked={(this.state.selectedDifficulty == 'HARD')} onChange={this.toggleDifficultyChange} /><label id='labelDifficultyHard' htmlFor='difficultyHard' tabIndex='2' onFocus={this.checkOnFocus} onKeyDown={onKeyDownDifficultyHardRadio}> <span></span> HARD </label>
                </label>
                <label className='optionGroupTitle'>
                    <span className='title'>Questions Amount: </span>
                    <input type="radio" id='questionsLow' name='questionsAmount' className='radioDefault' value="30" checked={(this.state.selectedQuestionsAmount == '30')} onChange={this.toggleQuestionsAmountChange} /><label id='labelQuestionsLow' htmlFor='questionsLow' tabIndex='3' onFocus={this.checkOnFocus} onKeyDown={onKeyDownQuestionsLowRadio}> <span></span> 30 </label>
                    <input type="radio" id='questionsMiddle' name='questionsAmount' className='radioDefault' value="60" checked={(this.state.selectedQuestionsAmount == '60')} onChange={this.toggleQuestionsAmountChange} /><label id='labelQuestionsMiddle' htmlFor='questionsMiddle' tabIndex='4' onFocus={this.checkOnFocus} onKeyDown={onKeyDownQuestionsMiddleRadio}> <span></span> 60 </label>
                    <input type="radio" id='questionsHight' name='questionsAmount' className='radioDefault' value="90" checked={(this.state.selectedQuestionsAmount == '90')} onChange={this.toggleQuestionsAmountChange} /><label id='labelQuestionsHight' htmlFor='questionsHight' tabIndex='5' onFocus={this.checkOnFocus} onKeyDown={onKeyDownQuestionsHightRadio} > <span></span> 90 </label>
                </label>
                <label className='optionGroupTitle'>
                    <span className='title'>Target Time (minutes): </span>
                    <input type="radio" id='targetTimeLow' name='targetTime' className='radioDefault' value="300000" checked={(this.state.selectedMaxSeconds == '300000')} onChange={this.toggleMaxSecondsChange} /><label id='labelTargetTimeLow' htmlFor='targetTimeLow' tabIndex='6' onFocus={this.checkOnFocus} onKeyDown={onKeyDownTargetTimeLowRadio}> <span></span> 5 </label>
                    <input type="radio" id='targetTimeMiddle' name='targetTime' className='radioDefault' value="600000" checked={(this.state.selectedMaxSeconds == '600000')} onChange={this.toggleMaxSecondsChange} /><label id='labelTargetTimeMiddle' htmlFor='targetTimeMiddle' tabIndex='7' onFocus={this.checkOnFocus} onKeyDown={onKeyDownTargetTimeMiddleRadio}> <span></span> 10 </label>
                    <input type="radio" id='targetTimeHight' name='targetTime' className='radioDefault' value="900000" checked={(this.state.selectedMaxSeconds == '900000')} onChange={this.toggleMaxSecondsChange} /><label id='labelTargetTimeHight' htmlFor='targetTimeHight' tabIndex='8' onFocus={this.checkOnFocus} onKeyDown={onKeyDownTargetTimeHightRadio}> <span></span> 15 </label>
                </label>
                <input type='button' id='btnStart' className="btnDefault" autoFocus value={this.state.loading ? 'Loading...' : 'Start!'} disabled={this.state.loading} onClick={this.startChallengeHandler} tabIndex='9' onKeyDown={onKeyDownStartButton} />
                <input type='button' id='btnOptions' className="btnDefault" value='Options' onClick={this.optionsHandler} tabIndex='10' onKeyDown={onKeyDownOptionsButton} />
            </div>);
    }
}

module.exports = MainMenuView;