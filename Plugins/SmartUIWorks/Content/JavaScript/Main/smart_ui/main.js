"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = Main;
const React = require("react");
const Components = require("./components");
const react_umg_1 = require("react-umg");
function Main(coreWidget) {
    console.log("running smart ui main");
    react_umg_1.ReactUMG.init(coreWidget);
    return react_umg_1.ReactUMG.render(React.createElement(Components.MainComponent, null));
}
//# sourceMappingURL=main.js.map