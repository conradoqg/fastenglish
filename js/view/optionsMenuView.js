let { Component } = require('react');
let React = require('react');
let KeyboardNavigation = require('./keyboardNavigation');

class OptionsMenuView extends Component {
    constructor(props) {
        super(props);
        this.clearHistoryHandler = this.clearHistoryHandler.bind(this);
        this.backHandler = this.backHandler.bind(this);
        this.adminHandler = this.adminHandler.bind(this);        
        this.messageTimeout = null;
        this.state = {
            message: null
        };        
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
        let onKeyDownClearHistoryButton = KeyboardNavigation.createKeyDownHandler({
            'ArrowUp': 'btnBack',
            'ArrowDown': 'btnAdmin'
        });
        let onKeyDownAdminButton = KeyboardNavigation.createKeyDownHandler({
            'ArrowUp': 'btnClearHistory',
            'ArrowDown': 'btnBack'
        });
        let onKeyDownBackButton = KeyboardNavigation.createKeyDownHandler({
            'ArrowUp': 'btnAdmin',
            'ArrowDown': 'btnClearHistory'
        });

        return (<div className='middle'>
            <input type='button' id='btnClearHistory' className="btnDefault" autoFocus value='Clear history' onClick={this.clearHistoryHandler} onKeyDown={onKeyDownClearHistoryButton} /><br />
            <input type='button' id='btnAdmin' className="btnDefault" value='Admin' onClick={this.adminHandler} onKeyDown={onKeyDownAdminButton} /><br />
            <input type='button' id='btnBack' className="btnDefault" value='Back' onClick={this.backHandler} onKeyDown={onKeyDownBackButton} /><br />
            {messageToRender}
        </div>);
    }
}

module.exports = OptionsMenuView;