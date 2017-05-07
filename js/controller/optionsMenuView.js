const { Component } = require('react');
const React = require('react');

class OptionsMenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: null
        };
        this.clearHistoryHandler = this.clearHistoryHandler.bind(this);
        this.backHandler = this.backHandler.bind(this);
        this.adminHandler = this.adminHandler.bind(this);
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

    render() {
        return (
            <div className='middle'>
                {this.state.message}<br/>
                <input type='button' className="btnDefault" autoFocus value='Clear history' onClick={this.clearHistoryHandler} /><br/>
                <input type='button' className="btnDefault" autoFocus value='Admin' onClick={this.adminHandler} /><br/>
                <input type='button' className="btnDefault" value='Back' onClick={this.backHandler} />
            </div>);
    }
}

module.exports = OptionsMenuView;