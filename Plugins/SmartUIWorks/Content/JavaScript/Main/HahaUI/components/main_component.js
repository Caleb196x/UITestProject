"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainComponent = void 0;
const React = require("react");
require("./style.css");
const color_test_1 = require("./tests/color.test");
class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        // 初始化状态
        this.state = {
            username: '输入用户名',
            password: '输入密码',
        };
    }
    // 渲染方法
    render() {
        return React.createElement(color_test_1.ColorTest, null);
    }
}
exports.MainComponent = MainComponent;
//# sourceMappingURL=main_component.js.map