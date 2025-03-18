"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainComponent = void 0;
const React = require("react");
const reactUMG_1 = require("reactUMG");
const ue_1 = require("ue");
const face_png_1 = require("../assets/face.png");
require("./style.css");
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
                        React.createElement("option", null, "test2")),
                    React.createElement("textarea", { onSubmit: (e) => { console.log(e.target); } })),
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement("button", { onClick: () => { console.log("hello"); }, onMouseDown: () => { console.log("mouse down and press"); }, onMouseUp: () => { console.log("mouse up and release"); }, onMouseEnter: () => { console.log("mouse enter"); }, onMouseLeave: () => { console.log("mouse leave"); }, title: 'hello' }, '原生按钮'),
                    React.createElement("p", null,
                        "\u8FD9\u662F\u4E00\u4E2A\u5BCC\u6587\u672C\u5D4C\u5165\u6D4B\u8BD5",
                        React.createElement("mark", null, "\u9AD8\u4EAE\u6587\u5B57"),
                        "\u6587\u672C\u7ED3\u675F\u4E86\uFF01",
                        React.createElement("strong", null, "\u5D4C\u5957\u52A0\u7C97"))),
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement("img", { src: face_png_1.default, width: 512, height: 512 }),
                    React.createElement("textarea", { defaultValue: '默认内容', placeholder: '\u8BF7\u8F93\u5165\u591A\u884C\u5185\u5BB9...', onChange: (e) => { console.log("on change: " + e.target.value); }, onSubmit: (e) => { console.log("on submit: " + e.target); }, onBlur: (e) => { console.log("on blur: " + e.target.value); } }),
                    React.createElement("div", { style: { backgroundImage: 'url(face.png)', backgroundSize: 'cover', backgroundPosition: 'center',
                            width: '512px', height: '512px', justifyContent: 'stretch', padding: '10px', gap: '10px' } })),
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement("button", { onClick: () => { console.log('button1 click'); } }, "\u6309\u94AE1")),
                        React.createElement("li", null,
                            React.createElement("button", { onClick: () => { console.log('button2 click'); } }, "\u6309\u94AE2")),
                        React.createElement("li", null,
                            React.createElement("button", { onClick: () => { console.log('button3 click'); } }, "\u6309\u94AE3")),
                        React.createElement("li", null,
                            React.createElement("button", { onClick: () => { console.log('button4 click'); } }, "\u6309\u94AE4")))),
                React.createElement("div", { style: {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    } },
                    React.createElement("button", { style: { alignSelf: 'flex-start' } }, "\u6309\u62111"),
                    React.createElement("button", { style: { alignSelf: 'flex-end' } }, "\u6309\u62112")),
                React.createElement("div", { className: 'container' },
                    React.createElement("button", { style: { alignSelf: 'stretch' } }, "\u6572\u62111"),
                    React.createElement("button", { style: { alignSelf: 'stretch' } }, "\u6572\u62112"))));
    }
}
exports.MainComponent = MainComponent;
//# sourceMappingURL=main_component.js.map