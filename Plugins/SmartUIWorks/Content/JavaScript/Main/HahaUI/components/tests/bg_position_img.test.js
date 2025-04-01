"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundPositionTest = void 0;
const React = require("react");
// import face from '@assets/face.png' // fixme@Caleb196x: 这种路径写法在require中无法加载
const face_png_1 = require("../../../assets/face.png");
class BackgroundPositionTest extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', width: '600px', height: '600px', backgroundColor: 'red' } },
            React.createElement("div", { style: { backgroundImage: `url(${face_png_1.default})`, backgroundColor: '#45a0a0', backgroundPosition: 'top left', color: 'rgba(87, 161, 3, 0.7)' } },
                React.createElement("span", null, "top left Position Test rgb(143, 3, 3)")),
            React.createElement("div", { style: { backgroundPosition: 'top center', color: 'rgba(3, 27, 161, 0.7)' } },
                React.createElement("span", null, "top center Position Test")),
            React.createElement("div", { style: { backgroundPosition: 'top right', color: 'rgba(203, 18, 11, 0.7)' } },
                React.createElement("span", null, "top right Position Test")),
            React.createElement("div", { style: { backgroundPosition: 'left right', color: 'rgba(186, 8, 240, 0.7)' } },
                React.createElement("span", null, "left right Position Test")),
            React.createElement("div", { style: { backgroundPosition: 'right center', color: 'rgba(23, 128, 144, 0.7)' } },
                React.createElement("span", null, "right center Position Test")),
            React.createElement("div", { style: { backgroundPosition: 'bottom', color: 'rgba(54, 177, 173, 0.7)' } },
                React.createElement("span", null, "bottom Position Test")),
            React.createElement("div", { style: { backgroundPosition: '2em 2em', color: 'rgba(82, 55, 55, 0.7)' } },
                React.createElement("span", null, "2em 2em Position Test")),
            React.createElement("div", { style: { backgroundPosition: 'left bottom 25px', color: 'rgba(176, 72, 72, 0.7)' } },
                React.createElement("span", null, "bottom 25px 10px Position Test")),
            React.createElement("div", { style: { backgroundPosition: 'center 2em right 2em', color: 'rgba(28, 28, 226, 0.7)' } },
                React.createElement("span", null, "center 2em right 2em Position Test"))));
    }
}
exports.BackgroundPositionTest = BackgroundPositionTest;
//# sourceMappingURL=bg_position_img.test.js.map