"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainComponent = void 0;
const React = require("react");
require("./style.css");
const rive_test_1 = require("./tests/rive.test");
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
        return React.createElement(rive_test_1.RiveUIExample, null); // fixme@Caleb196x: 替换为FlexStyleTest后无法重新加载
    }
}
exports.MainComponent = MainComponent;
//# sourceMappingURL=main_component.js.map