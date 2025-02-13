"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Load = Load;
const React = require("react");
const react_umg_1 = require("react-umg");
const ui_components_1 = require("./ui-components");
let SlotOfVerticalBox = {
    LayoutData: {
        Offsets: {
            Left: 120,
            Top: 120,
            Right: 480,
            Bottom: 80
        }
    }
};
class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            names: props.names,
            buttonTextureIndex: 0,
        };
    }
    render() {
        return (React.createElement(react_umg_1.CanvasPanel, null,
            React.createElement(react_umg_1.VerticalBox, { Slot: SlotOfVerticalBox },
                React.createElement(react_umg_1.HorizontalBox, null,
                    React.createElement(react_umg_1.Button, { OnHovered: () => this.setState({ buttonTextureIndex: 1 }), OnUnhovered: () => this.setState({ buttonTextureIndex: 0 }) }, this.state.buttonTextureIndex == 0 ? 'normal' : 'hovered')),
                this.state.names.map((name, idx) => React.createElement(ui_components_1.StatusBar, { name: name, key: idx })))));
    }
}
let SlotOfVerticalBoxOfLogin = {
    LayoutData: {
        Offsets: {
            Left: 420,
            Top: 500,
            Right: 180,
            Bottom: 100
        }
    }
};
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'liumingyuan',
            password: '',
        };
    }
    handleLogin = () => {
        // 这里可以添加登录逻辑，比如调用API验证用户
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);
        console.log(`Welcome, ${this.state.username}!`);
    };
    render() {
        return React.createElement(react_umg_1.CanvasPanel, null,
            React.createElement(react_umg_1.VerticalBox, { Slot: SlotOfVerticalBoxOfLogin },
                React.createElement(react_umg_1.HorizontalBox, null,
                    React.createElement(react_umg_1.TextBlock, { Text: 'Username: ' }),
                    React.createElement(react_umg_1.EditableText, { Text: this.state.username, OnTextChanged: (text) => { this.setState({ username: text }); } })),
                React.createElement(react_umg_1.HorizontalBox, null,
                    React.createElement(react_umg_1.Button, { OnClicked: () => this.handleLogin() }, 'Login'))));
    }
}
function Load() {
    return react_umg_1.ReactUMG.render(React.createElement(react_umg_1.CanvasPanel, null,
        React.createElement(Hello, { names: ["Health:", "Energy:"] }),
        React.createElement(Login, { names: ["login"] })));
}
;
//# sourceMappingURL=index.js.map