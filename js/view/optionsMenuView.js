const { Component } = require('react');
const React = require('react');

class OptionsMenuView extends Component {
    constructor(props) {
        super(props);
        this.clearHistoryHandler = this.clearHistoryHandler.bind(this);
        this.backHandler = this.backHandler.bind(this);
        this.adminHandler = this.adminHandler.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.state = {
            message: null
        };
        this.messageTimeout = null;
    }

    clearHistoryHandler() {
        this.props.engine.historyStorage.clear();
        this.setState({ message: 'Cleared!' });
    }

    backHandler() {
        this.props.changeMenuTo('MAIN');
    }

    adminHandler() {
        this.props.changeMenuTo('ADMIN');
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

    componentWillUnmount() {
        clearTimeout(this.messageTimeout);
    }

    render() {
        let messageToRender = null;
        if (this.state.message) {
            messageToRender = (<p><span id='message' className='message success'>{this.state.message}</span></p>);
            this.messageTimeout = setTimeout(() => {
                this.setState({
                    message: null
                });
            }, 6000);
        }

        return (<div className='middle'>
            <input type='button' id='btnClearHistory' className="btnDefault" autoFocus value='Clear history' onClick={this.clearHistoryHandler} onKeyDown={(e) => { return this.handleKeyPress(e, null, null, 'btnBack', 'btnAdmin'); }} /><br />
            <input type='button' id='btnAdmin' className="btnDefault" value='Admin' onClick={this.adminHandler} onKeyDown={(e) => { return this.handleKeyPress(e, null, null, 'btnClearHistory', 'btnBack'); }} /><br />
            <input type='button' id='btnBack' className="btnDefault" value='Back' onClick={this.backHandler} onKeyDown={(e) => { return this.handleKeyPress(e, null, null, 'btnAdmin', 'btnClearHistory'); }} /><br />
            {messageToRender}
        </div>);
    }
}

module.exports = OptionsMenuView;