$(document).ready(function () {
  window.colors = getColors('.colors');
  createChart();
  window.app = new App();
  app.start();
});

var AppView = React.createClass({
  getInitialState: function () {
    return this.props.app;
  },

  gameStarted: function () {
    this.forceUpdate();
  },

  gameEnded: function () {
    this.forceUpdate();
  },

  componentDidMount: function () {

  },

  render: function () {
    var renderToContent = null;

    switch (this.state.gameEngine.gameState.state) {
      case 'MENU':
        renderToContent = (<MenuView engine={this.state.gameEngine} gameStarted={this.gameStarted}/>);
        break;
      case 'CHALLENGING':
        renderToContent = (<ChallengeView engine={this.state.gameEngine} challenge={this.state.gameEngine.gameState.runningChallenge} gameEnded={this.gameEnded}/>);
      default:
        break;
    }

    var toRender = (
      <div className='wrapper'>
        <div className="header">
          <div className='progressBar' id='progressBar'></div>
          <h1>Fast English!</h1>
        </div>
        <div className="main">
          <div className="box sidebar"></div>
          <div className="box content">
            {renderToContent}
          </div>
          <div className="box sidebar">
            <ul className='no-bullets'>
              <li className='spaced'><a href='https://gitlab.com/conradoqg/fastenglish'>Contribute</a></li>
              <li className='spaced'><a href='http://conradoqg.eti.br'>Creator</a></li>
            </ul>
          </div>
        </div>
        <div className="footer">
          <div className='footerWrapper' id='chart'></div>
        </div>
      </div>);

    return toRender;
  }
});

var MenuView = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      selectedDificulty: 'EASY',
      selectedQuestionsAmount: '30',
      selectedMaxSeconds: '300000'
    }
  },

  toggleDificultyChange: function (event) {
    this.setState({
      selectedDificulty: event.target.value
    });
  },

  toggleQuestionsAmountChange: function (event) {
    this.setState({
      selectedQuestionsAmount: event.target.value
    });
  },

  toggleMaxSecondsChange: function (event) {
    this.setState({
      selectedMaxSeconds: event.target.value
    });
  },

  startChallengeHandler: function () {
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
  },

  render: function () {
    return (
      <div className='middle'>
        <label className='optionGroupTitle'>
          <span className='title'>Dificulty: </span>
          <input type="radio" id='dificultyEasy' name='dificulty' className='radioDefault' value="EASY" checked={(this.state.selectedDificulty == 'EASY') } onChange={this.toggleDificultyChange} /><label htmlFor='dificultyEasy'> <span></span> EASY </label>
          <input type="radio" id='dificultyMedium' name='dificulty' className='radioDefault' value="MEDIUM" checked={(this.state.selectedDificulty == 'MEDIUM') } onChange={this.toggleDificultyChange} /><label htmlFor='dificultyMedium'> <span></span> MEDIUM </label>
          <input type="radio" id='dificultyHard' name='dificulty' className='radioDefault' value="HARD" checked={(this.state.selectedDificulty == 'HARD') } onChange={this.toggleDificultyChange} /><label htmlFor='dificultyHard'> <span></span> HARD </label>
        </label>
        <label className='optionGroupTitle'>
          <span className='title'>Questions Amount: </span>
          <input type="radio" id='questionsLow' name='questionsAmount' className='radioDefault' value="30" checked={(this.state.selectedQuestionsAmount == '30') } onChange={this.toggleQuestionsAmountChange} /><label htmlFor='questionsLow'> <span></span> 30 </label>
          <input type="radio" id='questionsMiddle' name='questionsAmount' className='radioDefault' value="60" checked={(this.state.selectedQuestionsAmount == '60') } onChange={this.toggleQuestionsAmountChange} /><label htmlFor='questionsMiddle'> <span></span> 60 </label>
          <input type="radio" id='questionsHight' name='questionsAmount' className='radioDefault' value="90" checked={(this.state.selectedQuestionsAmount == '90') } onChange={this.toggleQuestionsAmountChange} /><label htmlFor='questionsHight'> <span></span> 90 </label>
        </label>
        <label className='optionGroupTitle'>
          <span className='title'>Target Time (minutes): </span>
          <input type="radio" id='targetTimeLow' name='targetTime' className='radioDefault' value="300000" checked={(this.state.selectedMaxSeconds == '300000') } onChange={this.toggleMaxSecondsChange}/><label htmlFor='targetTimeLow'> <span></span> 5 </label>
          <input type="radio" id='targetTimeMiddle' name='targetTime' className='radioDefault' value="600000" checked={(this.state.selectedMaxSeconds == '600000') } onChange={this.toggleMaxSecondsChange}/><label htmlFor='targetTimeMiddle'> <span></span> 10 </label>
          <input type="radio" id='targetTimeHight' name='targetTime' className='radioDefault' value="900000" checked={(this.state.selectedMaxSeconds == '900000') } onChange={this.toggleMaxSecondsChange}/><label htmlFor='targetTimeHight'> <span></span> 15 </label>
        </label>
        <input type='button' className="btnDefault" autoFocus value={this.state.loading ? 'Loading...': 'Start!'} disabled={this.state.loading} onClick={this.startChallengeHandler}/>
      </div>);
  }
});

var ChallengeView = React.createClass({
  getInitialState: function () {
    return {
      challenge: this.props.challenge
    };
  },

  restartChallenge: function () {
    this.props.challenge.restart();
    this.forceUpdate();
  },

  endGame: function () {
    this.props.engine.end();
    this.props.gameEnded();
  },

  challengeEnded: function () {
    drawChart();
    this.forceUpdate();
  },

  render: function () {
    switch (this.state.challenge.state) {
      case 'CREATED':
      case 'RUNNING':
        return (<ChallengingView challenge={this.state.challenge} challengeEnded={this.challengeEnded}/>);
      case 'ENDED':
        return (<ChallengeResultView challenge={this.state.challenge} endGame={this.endGame} restartChallenge={this.restartChallenge}/>);
      default:
        break;
    }
  }
});

var ChallengingView = React.createClass({
  getInitialState: function () {
    return {
      anwser: '',
      challenge: this.props.challenge,
      lastQuestionResult: ''
    }
  },

  componentDidMount: function () {
    var self = this;
    this.interval = setInterval(function () {
      if (self.props.challenge.state == 'RUNNING') {
        self.props.challenge.checkIfChallengedTimedout();
        progressBarUpdate('progressBar', colors['positive'], colors['negative'], (100 * self.props.challenge.elapsedSeconds()) / self.props.challenge.maxTime);
      } else if (self.props.challenge.state == 'ENDED') {
        clearInterval(self.interval);
        progressBarUpdate('progressBar', colors['positive'], colors['negative'], 100);
        self.setState({
          challenge: self.props.challenge
        });
      }
    }, 10);
  },

  componentWillUnmount: function () {
    if (this.interval) clearInterval(this.interval);
  },

  anwserHandle: function (event) {
    this.setState({
      anwser: event.target.value
    });
  },

  handleKeyPress: function (event) {
    if (event.key == 'Enter') {
      this.respondHandle();
    }
  },

  respondHandle: function () {
    var result = this.props.challenge.anwserQuestion(this.state.anwser);

    if (result != null) {
      this.props.challenge.nextQuestion();
      if (result.isCorrect) {
        success.play();
        setTimeout(function () {
          $('#anwserButton').velocity({
            borderBottomColor: rgbToHex(colors['positive'])
          }, 300).velocity({
            borderBottomColor: rgbToHex(colors['frontcolor'])
          }, 1000);
        }, 200);
      } else fail.play();
    }

    this.setState({
      anwser: '',
      challenge: this.props.challenge,
      lastQuestionResult: result
    });
  },

  render: function () {
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
      var toRender = (
        <div>
          <div className='middle'>
            <h2>{this.state.challenge.qaPair[this.state.challenge.currentQuestion].question}</h2>
            <label>Anwser:
              <input type='text' autoFocus id='anwserButton' className='textboxDefault' value={this.state.anwser} onChange={this.anwserHandle} onKeyPress={this.handleKeyPress} placeholder='Your anwser'/>
            </label>
            <input type='button' className="btnDefault" onClick={this.respondHandle} value='Next!' />
          </div>
          <div className='middle-bottom'>
            {result}
          </div>
        </div>
      );
    } else {
      var toRender = (
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
});

var ChallengeResultView = React.createClass({
  getInitialState: function () {
    return this.props.challenge.results[Object.keys(this.props.challenge.results)[0]];
  },

  render: function () {

    return (
      <div>
        <div className='result'>
          <span><b>Level: </b>{this.state.level}</span>
          <span><b>Duration: </b>{moment.duration(this.state.milisecondsDone).format("h [hrs], m [min], s [sec], S [ms]") }</span>
          <span><b>Correct Anwsers: </b>{this.state.correctAnwsers}</span>
          <span><b>Points: </b>{this.state.points.toFixed(2)}</span>
        </div>
        <input type='button' className="btnDefault" value='Restart!' onClick={this.props.restartChallenge} />
        <input type='button' className="btnDefault" value='Menu' autoFocus onClick={this.props.endGame}/>
      </div>
    );
  }
});

ReactDOM.render(<AppView app={app}/>, document.getElementById('app'));