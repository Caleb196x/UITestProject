"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainComponent = void 0;
const React = require("react");
const reactUMG_1 = require("reactUMG");
const status_bar_compoennt_1 = require("./status_bar_compoennt");
require("./style.css");
const face_png_1 = require("../assets/face.png");
class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'test.name',
            password: '',
            progressVal: 0.0,
        };
    }
    handleLogin = () => {
        // 这里可以添加登录逻辑，比如调用API验证用户
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);
        console.log(`Welcome, ${this.state.username}!`);
        this.textblock_ref.current.nativePtr.SetText('你好啊, ' + this.state.username);
        // this.css.color = '#0f13';
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
    textblock_ref = React.createRef();
    css;
    buttonStyle = {
        backgroundColor: 'green',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };
    render() {
        return React.createElement(reactUMG_1.CanvasPanel, null,
            React.createElement(reactUMG_1.VerticalBox, { Slot: this.SlotOfVerticalBox },
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement(reactUMG_1.TextBlock, { ref: this.textblock_ref, Text: 'Username: ' }),
                    React.createElement(reactUMG_1.EditableText, { Text: this.state.username, OnTextChanged: (text) => { this.setState({ username: text }); } })),
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement(reactUMG_1.Button, { OnClicked: () => this.handleLogin() }, 'Login'),
                    React.createElement(status_bar_compoennt_1.StatusBar, { name: 'Healthy: ', initialPercent: 60 })),
                React.createElement(reactUMG_1.HorizontalBox, null,
                    React.createElement("input", { type: 'text', value: this.state.username, onChange: (e) => this.setState({ username: e.target.value }), placeholder: '\u8F93\u5165\u5185\u5BB9...', "aria-label": '\u7528\u6237\u540D', required: true }),
                    React.createElement("button", { style: this.buttonStyle, onClick: () => this.handleLogin() }, "\u6D4B\u8BD5\u539F\u751F\u6309\u94AE")),
                React.createElement("div", { style: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' } },
                    React.createElement("select", { style: { alignSelf: 'flex-start' }, defaultValue: "C", onChange: (e) => { console.log("onChange: ", e.target); } },
                        React.createElement("option", { value: "A" }, "a"),
                        React.createElement("option", { value: "B" }, "b"),
                        React.createElement("option", { value: "C" }, "c"),
                        React.createElement("option", { value: "D" }, "d")),
                    React.createElement("img", { src: face_png_1.default, style: { width: '100%', height: '100%' } }),
                    React.createElement("progress", { style: { alignSelf: 'stretch' }, value: this.state.progressVal, max: 100 }, "\u8FDB\u5EA6\u6761"),
                    React.createElement("button", { style: { alignSelf: 'end' }, onClick: () => { this.setState({ progressVal: Math.min(this.state.progressVal + 5, 100) }); } }, "\u589E\u52A0\u8FDB\u5EA6"),
                    React.createElement("button", { style: { alignSelf: 'left' }, onClick: () => { this.setState({ progressVal: Math.max(this.state.progressVal - 5, 0) }); } }, "\u51CF\u5C11\u8FDB\u5EA6")),
                React.createElement("div", { className: 'container' },
                    React.createElement("div", { className: 'item' }, "1"),
                    React.createElement("div", { className: 'item' }, "2"),
                    React.createElement("div", { className: 'item' }, "3"))));
    }
}
exports.MainComponent = MainComponent;
//# sourceMappingURL=main_component.js.map