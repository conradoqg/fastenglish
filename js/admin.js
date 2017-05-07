var AdminView = React.createClass({
    getInitialState: function () {
        return {
            username: '',
            password: '',
            logged: firebase.auth().currentUser != null,
            isLogging: false,
            message: '',
            messageType: null,
        }
    },

    onAuthClickHandler: function () {
        if (this.state.logged) this.logout();
        else {
            this.setState({
                isLogging: true
            });
        }
    },

    clearDatabase: function () {
        return firebase.database().ref('questions').remove();
    },

    onClearDataHandler: function () {
        var self = this;
        this.clearDatabase().then(function () {
            self.setState({
                messageType: '1',
                message: 'Questions table removed successfully!'
            });
        }).catch(function (error) {
            self.setState({
                messageType: '2',
                message: 'Error while removing questions: ' + error.message
            });
        });
    },

    onInsertTestDataHandler: function () {
        var self = this;
        this.clearDatabase().then(function () {
            var ref = firebase.database().ref('questions');
            return new Promise(function (fulfill, reject) {
                $.ajax({
                    url: 'data/questions.json',
                    dataType: 'json',
                    error: function (xhr, errorType, error) {
                        reject(error);
                    },
                    success: function (data, status, xhr) {
                        fulfill(data);
                    }
                });
            }).then(function (questions) {
                return Promise.all(questions.map(function (record) {
                    return ref.push().set(record);
                }));
            });
        }).then(function () {
            self.setState({
                messageType: '1',
                message: 'Questions table records added successfully!'
            });
        }).catch(function (error) {
            self.setState({
                messageType: '2',
                message: 'Error while adding questions: ' + error.message
            });
        });
    },

    onChangeUsername: function (event) {
        this.setState({ username: event.target.value });
    },

    onChangePassword: function (event) {
        this.setState({ password: event.target.value });
    },

    login: function (username, password) {
        var self = this;
        firebase.auth().signInWithEmailAndPassword(username, password).then(function (result) {
            self.setState({
                username: '',
                password: '',
                logged: true,
                isLogging: false,
                messageType: '1',
                message: 'Authenticated successfully!'
            });
        }).catch(function (error) {
            self.setState({
                logged: false,
                messageType: '2',
                message: 'Authentication Failed!\n' + error.message
            });
        });
    },

    logout: function () {
        var self = this;
        firebase.auth().signOut().then(function () {
            self.setState({
                logged: false,
                messageType: '1',
                message: 'Logged out successfully!'
            });
        });
    },

    onConfirmLogin: function () {
        this.login(this.state.username, this.state.password);
    },

    render: function () {
        var content = null;
        var message = null;
        var self = this;

        if (this.state.isLogging) {
            content = (
                <form>
                    <label>User: <input tabIndex='1' autoFocus type='text' id='usernameText' className='textboxDefault' value={this.state.username} onChange={this.onChangeUsername} placeholder='Username' /></label>
                    <label>Password: <input tabIndex='2' type='password' id='passwordText' className='textboxDefault' value={this.state.password} onChange={this.onChangePassword} placeholder='' /></label>
                    <input type='button' tabIndex='3' className='btnDefault' onClick={this.onConfirmLogin} value='Confirm' />
                </form>
            );
        };

        if (this.state.messageType) {
            var className = 'message';

            if (this.state.messageType == '1') className += ' success';
            else if (this.state.messageType == '2') className += ' fail';
            else if (this.state.messageType == '3') className += ' info';

            message = (<p><span id='message' className={className}>{this.state.message}</span></p>);

            if (this.state.messageType == '1' || this.state.messageType == '2') {
                setTimeout(function () {
                    self.setState({
                        messageType: null,
                        message: ''
                    });
                }, 6000);
            }
        }

        return (
            <div className='wrapper'>
                <div className="main">
                    <div className="box content">
                        <input type='button' className='btnDefault' onClick={this.onAuthClickHandler} value={(this.state.logged ? 'Logout' : 'Login')} />
                        <input type='button' className='btnDefault' onClick={this.onClearDataHandler} value='Clear Data' />
                        <input type='button' className='btnDefault' onClick={this.onInsertTestDataHandler} value='Insert Base Questions' />
                        {content}
                        {message}
                    </div>
                </div>
            </div>);
    }
});

ReactDOM.render(<AdminView />, document.getElementById('app'));