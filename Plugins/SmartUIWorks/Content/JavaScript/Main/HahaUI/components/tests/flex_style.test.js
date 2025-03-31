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
        flex: 1
    };
    render() {
        return React.createElement("div", { style: this.containerStyle },
            React.createElement("div", { style: this.headerStyle },
                React.createElement("h1", { style: { alignSelf: 'center' } }, "\u8FD9\u662F\u4E00\u4E2A\u6807\u9898: \u6D4B\u8BD5flex\u5BB9\u5668\u517C\u5BB9\u6027")),
            React.createElement("div", { style: this.contentStyle },
                React.createElement("div", { style: this.buttonBorderStyle },
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgba(9, 216, 9, 1)' } }, "\u5F00\u59CB\u6E38\u620F"),
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgb(201, 39, 174)' } }, "\u5F00\u59CB\u6E38\u620F")),
                React.createElement("div", { style: this.buttonBorderStyle },
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgba(179, 77, 14, 1)' } }, "\u7EE7\u7EED\u6E38\u620F")),
                React.createElement("div", { style: this.buttonBorderStyle },
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgba(114, 112, 111, 1)' } }, "\u6E38\u620F\u8BBE\u7F6E")),
                React.createElement("div", { style: this.buttonBorderStyle },
                    React.createElement("button", { style: { alignSelf: 'center', justifySelf: 'center', backgroundColor: 'rgba(13, 8, 4, 1)' } }, "\u6E38\u620F\u5E2E\u52A9"))));
    }
}
exports.FlexStyleTest = FlexStyleTest;
//# sourceMappingURL=flex_style.test.js.map