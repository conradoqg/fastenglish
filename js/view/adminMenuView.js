let { Component } = require('react');
let React = require('react');

class AdminMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            logged: firebase.auth().currentUser != null,
            isLogging: false,
            message: '',
            messageType: null,
        };
        this.onAuthClickHandler = this.onAuthClickHandler.bind(this);
        this.clearDatabase = this.clearDatabase.bind(this);
        this.onClearDataHandler = this.onClearDataHandler.bind(this);
        this.onInsertTestDataHandler = this.onInsertTestDataHandler.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.onConfirmLogin = this.onConfirmLogin.bind(this);
        this.backHandler = this.backHandler.bind(this);
    }

    onAuthClickHandler() {
        if (this.state.logged) this.logout();
        else {
            this.setState({
                isLogging: true
            });
        }
    }

    clearDatabase() {
        return firebase.database().ref('questions').remove();
    }

    onClearDataHandler() {
        this.clearDatabase().then(() => {
            this.setState({
                messageType: '1',
                message: 'Questions table removed successfully!'
            });
        }).catch((error) => {
            this.setState({
                messageType: '2',
                message: 'Error while removing questions: ' + error.message
            });
        });
    }

    onInsertTestDataHandler() {
        this.clearDatabase().then(() => {
            let ref = firebase.database().ref('questions');
            return new Promise(function (fulfill, reject) {
                $.ajax({
                    url: 'data/questions.json',
                    dataType: 'json',
                    error: function (xhr, errorType, error) {
                        reject(error);
                    },
                    success: function (data) {
                        fulfill(data);
                    }
                });
            }).then(function (questions) {
                return Promise.all(questions.map(function (record) {
                    return ref.push().set(record);
                }));
            });
        }).then(() => {
            this.setState({
                messageType: '1',
                message: 'Questions table records added successfully!'
            });
        }).catch((error) => {
            this.setState({
                messageType: '2',
                message: 'Error while adding questions: ' + error.message
            });
        });
    }

    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    login(username, password) {        
        firebase.auth().signInWithEmailAndPassword(username, password).then((result) => {
            this.setState({
                username: '',
                password: '',
                logged: true,
                isLogging: false,
                messageType: '1',
                message: 'Authenticated successfully!'
            });
            $('#btnLogin').focus();
        }).catch((error) => {
            this.setState({
                logged: false,
                messageType: '2',
                message: 'Authentication Failed!\n' + error.message
            });
        });
    }

    logout() {        
        firebase.auth().signOut().then(() => {
            this.setState({
                logged: false,
                messageType: '1',
                message: 'Logged out successfully!'
            });
        });
    }

    onConfirmLogin() {
        this.login(this.state.username, this.state.password);
    }

    backHandler() {
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
        let content = null;
        let message = null;        

        if (this.state.isLogging) {
            content = (
                <form>
                    <label>User: <input tabIndex='1' id='usernameText' autoFocus type='text' className='textboxDefault' value={this.state.username} onChange={this.onChangeUsername} placeholder='Username' onKeyDown={(e) => { return this.handleKeyPress(e, 'btnConfirm', 'passwordText', 'btnBack', 'btnLogin'); }} /></label>
                    <label>Password: <input type='password' id='passwordText' tabIndex='2' className='textboxDefault' value={this.state.password} onChange={this.onChangePassword} placeholder='' onKeyDown={(e) => { return this.handleKeyPress(e, 'usernameText', 'btnConfirm', 'btnBack', 'btnLogin'); }} /></label>
                    <input type='button' id='btnConfirm' tabIndex='3' className='btnDefault' onClick={this.onConfirmLogin} value='Confirm' onKeyDown={(e) => { return this.handleKeyPress(e, 'passwordText', 'usernameText', 'btnBack', 'btnLogin'); }} />
                </form>
            );
        }

        if (this.state.messageType) {
            let className = 'message';

            if (this.state.messageType == '1') className += ' success';
            else if (this.state.messageType == '2') className += ' fail';
            else if (this.state.messageType == '3') className += ' info';

            message = (<p><span id='message' className={className}>{this.state.message}</span></p>);

            if (this.state.messageType == '1' || this.state.messageType == '2') {
                setTimeout(() => {
                    this.setState({
                        messageType: null,
                        message: ''
                    });
                }, 6000);
            }
        }

        return (<div className="middle">
            <input type='button' id='btnLogin' className='btnDefault' autoFocus onClick={this.onAuthClickHandler} value={(this.state.logged ? 'Logout' : 'Login')} onKeyDown={(e) => { return this.handleKeyPress(e, null, null, 'btnBack', 'btnClearData'); }} /><br />
            <input type='button' id='btnClearData' className='btnDefault' onClick={this.onClearDataHandler} value='Clear Data' onKeyDown={(e) => { return this.handleKeyPress(e, null, null, 'btnLogin', 'btnInsertQuestions'); }} /><br />
            <input type='button' id='btnInsertQuestions' className='btnDefault' onClick={this.onInsertTestDataHandler} value='Insert Base Questions' onKeyDown={(e) => { return this.handleKeyPress(e, null, null, 'btnClearData', 'btnBack'); }} /><br />
            <input type='button' id='btnBack' className='btnDefault' onClick={this.backHandler} value='Back' onKeyDown={(e) => { return this.handleKeyPress(e, null, null, 'btnInsertQuestions', 'usernameText'); }} />
            {content}
            {message}
        </div>);
    }
}

module.exports = AdminMenuView;