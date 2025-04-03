"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapBoxExample = void 0;
const React = require("react");
const WrapBoxExample = ({ width = "600px", gap = "10px" }) => {
    const wrapBoxStyle = {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        width: "400px",
        height: "300px",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
        background: "#f0f9f0",
        color: "lightblue",
        justifyContent: "center",
        alignSelf: "center",
    };
    return React.createElement("div", null,
        React.createElement("div", { style: wrapBoxStyle },
            React.createElement("span", null, " // \u601D\u8DEF\uFF1A"),
            React.createElement("span", null, " \u6240\u6709\u503C\u7684\u5355\u4F4D\u76F8\u540C\u7684\u60C5\u51B5"),
            React.createElement("span", null, " 1. \u5982\u679C\u503C\u7684\u5355\u4F4D\u662F\u7EDD\u5BF9\u957F\u5EA6\u5982px, em, rem\uFF0C\u5219\u901A\u8FC7\u8BA1\u7B97\u6BCF\u4E2A\u503C\u6240\u5728\u6240\u6709\u503C\u7684\u6BD4\u4F8B\u4F5C\u4E3Afill\u503C\uFF1B"),
            React.createElement("span", null, " 2. \u5982\u679C\u5355\u4F4D\u662Ffr\uFF0C\u5219\u76F4\u63A5\u4F7F\u7528fr\u503C\uFF1B"),
            React.createElement("span", null, " \u503C\u7684\u5355\u4F4D\u4E0D\u540C\uFF0C\u6DF7\u5408\u4F7F\u7528\u7684\u60C5\u51B5"),
            React.createElement("span", null, " 3. \u5982\u679C\u5F53\u524D\u503C\u662Fauto, \u5219\u4F7F\u7528\u4E0A\u4E00\u4E2A\u503C\u8FDB\u884C\u8BA1\u7B97\uFF1B"),
            React.createElement("span", null, " 4. \u5982\u679C\u662Ffr\u548C\u5176\u4ED6\u7EDD\u5BF9\u957F\u5EA6\u5355\u4F4D\u6DF7\u5408\uFF0C\u5C06\u5176\u4ED6\u7EDD\u5BF9\u957F\u5EA6\u5355\u4F4D\u8F6C\u6362\u62101\u4E2Afr\u5355\u4F4D\uFF0C\u5E76\u7ED9\u51FA\u8B66\u544A\u4FE1\u606F\uFF1B")));
};
exports.WrapBoxExample = WrapBoxExample;
//# sourceMappingURL=wrapbox.test.js.map