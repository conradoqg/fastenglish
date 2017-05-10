const { Component } = require('react');
const React = require('react');
const MainMenuView = require('./mainMenuView');
const OptionsMenuView = require('./optionsMenuView');
const AdminMenuView = require('./adminMenuView');

class MenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: 'MAIN'
        };
        this.changeMenuTo = this.changeMenuTo.bind(this);
    }

    changeMenuTo(menu) {
        this.setState({ menu });
    }

    render() {
        let menuToRender = null;

        switch (this.state.menu) {
            case 'OPTIONS':
                menuToRender = (<OptionsMenuView engine={this.props.engine} changeMenuTo={this.changeMenuTo} />);
                break;
            case 'ADMIN':
                menuToRender = (<AdminMenuView changeMenuTo={this.changeMenuTo} />);
                break;
            case 'MAIN':
            default:
                menuToRender = (<MainMenuView engine={this.props.engine} gameStarted={this.props.gameStarted} changeMenuTo={this.changeMenuTo} />);
                break;
        }

        return menuToRender;
    }
}

module.exports = MenuView;