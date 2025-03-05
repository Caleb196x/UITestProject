"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainComponent = void 0;
const React = require("react");
const reactUMG_1 = require("reactUMG");
const ue_1 = require("ue");
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
        return React.createElement(reactUMG_1.CanvasPanel, null,
            React.createElement(reactUMG_1.VerticalBox, { Slot: this.SlotOfVerticalBox },
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement(reactUMG_1.TextBlock, { Text: '\u7528\u6237\u540D: ' }),
                    React.createElement(reactUMG_1.EditableText, { Text: this.state.username, OnTextChanged: (text) => { this.setState({ username: text }); } })),
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement(reactUMG_1.Button, { OnClicked: () => this.handleLogin(), ClickMethod: ue_1.EButtonClickMethod.MouseDown }, '登录')),
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement("select", { onChange: (e) => this.handleLogin(), defaultValue: 'test1' },
                        React.createElement("option", null, "test1"),
                        React.createElement("option", null, "test2"))),
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement("button", { onClick: () => { console.log("hello"); }, onMouseDown: () => { console.log("mouse down and press"); }, onMouseUp: () => { console.log("mouse up and release"); }, onMouseEnter: () => { console.log("mouse enter"); }, onMouseLeave: () => { console.log("mouse leave"); }, title: 'hello' }, '原生按钮'))));
    }
}
exports.MainComponent = MainComponent;
//# sourceMappingURL=main_component.js.map