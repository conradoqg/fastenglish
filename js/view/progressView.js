let { Component } = require('react');
let React = require('react');
let Theming = require('../util/theming');

class ProgressView extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }

    static getColor(color0, color1, percentage) {
        if (color0.toLowerCase().startsWith('rgb')) color0 = Theming.rgbToHex(color0);
        if (color1.toLowerCase().startsWith('rgb')) color1 = Theming.rgbToHex(color1);
        let r0 = parseInt(color0.substring(1, 3), 16);
        let g0 = parseInt(color0.substring(3, 5), 16);
        let b0 = parseInt(color0.substring(5, 7), 16);
        let r1 = parseInt(color1.substring(1, 3), 16);
        let g1 = parseInt(color1.substring(3, 5), 16);
        let b1 = parseInt(color1.substring(5, 7), 16);
        let rstep = (r1 - r0) / (100);
        let gstep = (g1 - g0) / (100);
        let bstep = (b1 - b0) / (100);
        r0 = Math.floor(r0 + (rstep * percentage));
        g0 = Math.floor(g0 + (gstep * percentage));
        b0 = Math.floor(b0 + (bstep * percentage));
        return 'rgb(' + r0 + ',' + g0 + ',' + b0 + ')';
    }

    render() {
        const progressStyle = {
            width: (this.props.progress == null ? 0 : (100 - this.props.progress)) + '%',
            backgroundColor: ProgressView.getColor(Theming.getColor('positive'), Theming.getColor('negative'), this.props.progress)
        };

        return (<div className='progressBar' style={progressStyle} id='progressBar'></div>);
    }
}

module.exports = ProgressView;