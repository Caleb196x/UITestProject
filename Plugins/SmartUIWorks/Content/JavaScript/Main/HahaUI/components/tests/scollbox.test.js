"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollBoxExample = void 0;
const React = require("react");
const ScrollBoxExample = ({ width = "400px", height = "300px" }) => {
    const scrollBoxStyle = {
        width: "400px",
        height: "300px",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#f0f9f9",
        scrollbarWidth: "thin", // 适用于 Firefox
        scrollbarColor: "#888 #f9f9f9", // 适用于 Firefox
        color: 'blueviolet'
    };
    const scrollBarStyle = `
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;
    return (React.createElement("div", { style: { justifyContent: 'center', alignItems: 'center' } },
        React.createElement("style", null, scrollBarStyle),
        React.createElement("div", { style: scrollBoxStyle },
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, "- \u601D\u8DEF\uFF1A\u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"))));
};
exports.ScrollBoxExample = ScrollBoxExample;
//# sourceMappingURL=scollbox.test.js.map