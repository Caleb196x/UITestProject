"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorTest = void 0;
const React = require("react");
class ColorTest extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
            React.createElement("div", { style: { backgroundColor: 'red', margin: '20px' } },
                React.createElement("span", null, "red background")),
            React.createElement("div", { style: { backgroundColor: 'saddlebrown', color: 'darkorchid', margin: '20px' } },
                React.createElement("span", null, "green background and darkorchid content")),
            React.createElement("div", { style: { backgroundColor: 'rgb(0, 0, 255)', margin: '20px' } },
                React.createElement("span", null, "blue background with rgb(0, 0, 255)")),
            React.createElement("div", { style: { backgroundColor: 'rgba(135, 206, 235, 0.5)', margin: '20px' } },
                React.createElement("span", null, "grey background with rgba(135, 206, 235, 0.5)")),
            React.createElement("div", { style: { backgroundColor: 'hsl(113, 86.50%, 29.00%)', margin: '20px' } },
                React.createElement("span", null, "gree background with hsl(113, 86.50%, 29.00%)")),
            React.createElement("div", { style: { backgroundColor: 'hsla(58, 82.00%, 48.00%, 0.71)', margin: '20px' } },
                React.createElement("span", null, "yellow background with hsla(58, 82.00%, 48.00%, 0.71)")),
            React.createElement("div", { style: { backgroundColor: '#17faf0', margin: '20px' } },
                React.createElement("span", null, "cyan background with #17faf0"))));
    }
}
exports.ColorTest = ColorTest;
//# sourceMappingURL=color.test.js.map