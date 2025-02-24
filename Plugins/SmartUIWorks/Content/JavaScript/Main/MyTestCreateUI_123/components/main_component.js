"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainComponent = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const status_bar_compoennt_1 = require("./status_bar_compoennt");
class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }
    handleLogin = () => {
        // 这里可以添加登录逻辑，比如调用API验证用户
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);
        console.log(`Welcome, ${this.state.username}!`);
    };
    SlotOfVerticalBox = {
        LayoutData: {
            Offsets: {
                Left: 120,
                Top: 100,
                Right: 180,
                Bottom: 100
            }
        }
    };
    render() {
        return React.createElement(react_umg_1.CanvasPanel, null,
            React.createElement(react_umg_1.VerticalBox, { Slot: this.SlotOfVerticalBox },
                React.createElement(react_umg_1.HorizontalBox, null,
                    React.createElement(react_umg_1.TextBlock, { Text: 'Username: ' }),
                    React.createElement(react_umg_1.EditableText, { Text: this.state.username, OnTextChanged: (text) => { this.setState({ username: text }); } })),
                React.createElement(react_umg_1.HorizontalBox, null,
                    React.createElement(react_umg_1.Button, { OnClicked: () => this.handleLogin() }, 'Login')),
                React.createElement(status_bar_compoennt_1.StatusBar, { name: 'Healthy: ', initialPercent: 60 })));
    }
}
exports.MainComponent = MainComponent;
//# sourceMappingURL=main_component.js.map