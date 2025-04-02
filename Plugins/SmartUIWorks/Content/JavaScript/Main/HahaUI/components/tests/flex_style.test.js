"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlexStyleTest = void 0;
const React = require("react");
class FlexStyleTest extends React.Component {
    constructor(props) {
        super(props);
    }
    containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };
    headerStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        justifySelf: 'center',
        width: '800px',
        height: '100px',
    };
    contentStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        width: '800px',
        height: '800px',
    };
    buttonBorderStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '800px',
        height: '200px',
        margin: '10px 20px 10px 20px',
        backgroundColor: 'rgb(34, 215, 6)',
        color: 'rgb(11, 33, 230)',
        flex: 1
    };
    render() {
        return React.createElement("div", { style: this.containerStyle },
            React.createElement("div", { style: this.headerStyle },
                React.createElement("h1", { style: { alignSelf: 'center', justifySelf: 'center' } }, "\u8FD9\u662F\u4E00\u4E2A\u6807\u9898: \u6D4B\u8BD5flex\u5BB9\u5668\u517C\u5BB9\u6027")),
            React.createElement("div", { style: this.contentStyle },
                React.createElement("div", { style: this.buttonBorderStyle },
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center' } }, "\u5F00\u59CB\u6E38\u620F"),
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center' } }, "\u5F00\u59CB\u6E38\u620F")),
                React.createElement("div", { style: this.buttonBorderStyle },
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center' } }, "\u7EE7\u7EED\u6E38\u620F")),
                React.createElement("div", { style: this.buttonBorderStyle },
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center' } }, "\u6E38\u620F\u8BBE\u7F6E")),
                React.createElement("div", { style: this.buttonBorderStyle },
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center' } }, "\u6E38\u620F\u5E2E\u52A9"))));
    }
}
exports.FlexStyleTest = FlexStyleTest;
//# sourceMappingURL=flex_style.test.js.map