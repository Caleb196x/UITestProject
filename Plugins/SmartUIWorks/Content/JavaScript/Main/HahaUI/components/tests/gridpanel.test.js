"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GridPanelExample;
const React = require("react");
require("./gridpanel.test.css");
function GridPanelExample() {
    const styles = {
        gridContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 3fr)", // 侧边栏 200px，主内容自适应
            gridTemplateRows: "repeat(3, 1fr)", // 头部 60px，内容自适应，底部 60px
            gap: "10px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            justifySelf: 'left',
            alignSelf: 'top',
        },
        item: {
            padding: "20px",
            fontSize: "18px",
            borderRadius: "5px",
        },
        header: {
            gridRow: "0 / 1",
            gridColumn: "0 / 3", // 跨所有列
            background: "lightcoral",
        },
        sidebar: {
            gridRow: "1 / 1",
            gridColumn: "0 / 1",
            background: "lightgreen",
        },
        content: {
            gridRow: "1 / 1",
            gridColumn: "1 / 3",
            background: "blue",
        },
        footer: {
            gridRow: "2 / 2",
            gridColumn: "0 / 3",
            background: "lightsalmon",
        },
    };
    return (React.createElement("div", { style: { width: "400px", height: "200px" } },
        React.createElement("div", { style: styles.gridContainer },
            React.createElement("div", { style: { ...styles.item, ...styles.header } }, "Header"),
            React.createElement("div", { style: { ...styles.item, ...styles.sidebar } }, "Sidebar"),
            React.createElement("div", { style: { ...styles.item, ...styles.content } }, "Main Content"),
            React.createElement("div", { style: { ...styles.item, ...styles.footer } }, "Footer"))));
}
//# sourceMappingURL=gridpanel.test.js.map