"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBar = void 0;
const React = require("react");
const reactUMG_1 = require("reactUMG");
let SlotOfProgressBar = {
    Size: {
        Value: 100,
        SizeRule: 1
    },
    Padding: {
        Left: 100,
        Right: 10,
    },
};
class StatusBar extends React.Component {
    constructor(props) {
        super(props);
        if ((props.initialPercent || 0) < 0) {
            throw new Error('initialPercent < 0');
        }
        this.state = {
            percent: props.initialPercent || 0.5
        };
    }
    get color() {
        return { R: 1 - this.state.percent, G: 0, B: this.state.percent };
    }
    onIncrement = () => this.setState({ percent: this.state.percent + 0.01 });
    onDecrement = () => this.setState({ percent: this.state.percent - 0.01 });
    onNativeClick = () => console.log('native button clicked');
    render() {
        return (React.createElement(reactUMG_1.HorizontalBox, { Slot: SlotOfProgressBar },
            React.createElement(reactUMG_1.TextBlock, { Text: `${this.props.name}(${this.state.percent.toFixed(2)})` }),
            React.createElement(reactUMG_1.ProgressBar, { Percent: this.state.percent, Slot: SlotOfProgressBar, FillColorAndOpacity: this.color, CategoryName: `${this.props.name}` }),
            React.createElement(reactUMG_1.Button, { OnClicked: this.onIncrement }, "+"),
            React.createElement(reactUMG_1.Button, { OnClicked: this.onDecrement }, "-"),
            React.createElement(reactUMG_1.TextBlock, { Text: '热重载测试_叽叽咋咋' })));
    }
}
exports.StatusBar = StatusBar;
//# sourceMappingURL=status_bar_compoennt.js.map